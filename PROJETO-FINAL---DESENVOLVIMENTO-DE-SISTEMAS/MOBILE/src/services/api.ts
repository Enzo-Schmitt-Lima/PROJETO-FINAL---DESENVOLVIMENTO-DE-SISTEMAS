import axios from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Determina automaticamente um baseURL para o backend:
// 1. Se executando via Expo, tentamos extrair o IP do bundler (debuggerHost)
// 2. Se Android emulator padrão, usamos 10.0.2.2
// 3. Senão, usa um fallback localhost/IP (você pode editar aqui se quiser)

let baseURL = 'http://10.106.131.40:3333'; // fallback - altere se preferir

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

export default api;