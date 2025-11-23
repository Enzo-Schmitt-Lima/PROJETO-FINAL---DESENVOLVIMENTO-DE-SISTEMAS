import axios from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Determina automaticamente um baseURL para o backend:
// 1. Se executando via Expo, tentamos extrair o IP do bundler (debuggerHost)
// 2. Se Android emulator padrão, usamos 10.0.2.2
// 3. Senão, usa um fallback localhost/IP (você pode editar aqui se quiser)

let baseURL = 'http://127.0.0.1:3333'; // fallback - altere se preferir

try {
  const manifest: any = Constants.manifest || (Constants as any).expoConfig;
  const debuggerHost = manifest && (manifest.debuggerHost || manifest.hostUri || manifest.packagerOpts?.packagerHost);
  if (debuggerHost && typeof debuggerHost === 'string') {
    // debuggerHost costuma vir como '192.168.x.x:8081' ou '10.62.x.x:8081'
    const host = debuggerHost.split(':')[0];
    if (host) {
      baseURL = `http://${host}:3333`;
    }
  } else if (Platform.OS === 'android') {
    // Emulador Android padrão
    baseURL = 'http://10.0.2.2:3333';
  }
} catch (e) {
  // se algo falhar, mantemos o fallback
  console.log('api.ts: não foi possível detectar debuggerHost, usando fallback baseURL', e);
}

const api = axios.create({ baseURL });

console.log('API baseURL configurada em:', baseURL);

// Interceptor que garante que, antes de cada requisição, o header Authorization esteja presente.
// Isso corrige casos onde o token ainda não foi aplicado em api.defaults por race conditions.
api.interceptors.request.use(
  async (config) => {
    try {
      if (config && config.headers && !config.headers['Authorization']) {
        const token = await AsyncStorage.getItem('@App:token');
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
      }
    } catch (e) {
      // não bloquear a requisição se houver erro ao ler storage
      console.log('api interceptor error reading token', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: tenta um retry único em caso de 401 lendo o token do AsyncStorage.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error?.response?.status;
    try {
      console.log('API response error status:', status);
    } catch (e) {}

    if (status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const stored = await AsyncStorage.getItem('@App:token');
        // If backend explicitly says token expired, clear storage and don't retry further
        const serverMsg = error?.response?.data?.error || '';
        if (typeof serverMsg === 'string' && /expired/i.test(serverMsg)) {
          console.log('Token expired according to server, clearing stored credentials');
          try { await AsyncStorage.removeItem('@App:token'); await AsyncStorage.removeItem('@App:user'); } catch (e) {}
          api.defaults.headers.common['Authorization'] = undefined;
          return Promise.reject(error);
        }

        if (stored) {
          // atualiza header global e do request original, então refaz a requisição
          api.defaults.headers.common['Authorization'] = `Bearer ${stored}`;
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers['Authorization'] = `Bearer ${stored}`;
          console.log('Retrying request with token from AsyncStorage');
          return api(originalRequest);
        }
      } catch (retryErr) {
        console.log('api response interceptor retry error', retryErr);
      }
    }

    return Promise.reject(error);
  }
);

export default api;