import React, { createContext, ReactNode, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import api from '../services/api';

interface UserProps {
  id: string;
  name: string;
  email: string;
  token: string;
}

interface SignInProps {
  email: string;
  password: string;
}

interface SignUpProps {
  name: string;
  email: string;
  password: string;
}

interface AuthContextData {
  user: UserProps | null;
  isAuthenticated: boolean;
  loadingAuth: boolean;
  signIn: (credentials: SignInProps) => Promise<UserProps | null>;
  signUp: (credentials: SignUpProps) => Promise<UserProps | null>;
  signOut: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(false);

  const isAuthenticated = !!user;

  useEffect(() => {
    async function loadStorageData() {
      const storageUser = await AsyncStorage.getItem('@App:user');
      const storageToken = await AsyncStorage.getItem('@App:token');

      if (storageUser && storageToken) {
        api.defaults.headers.common['Authorization'] = `Bearer ${storageToken}`;
        setUser(JSON.parse(storageUser));
      }
    }

    loadStorageData();
  }, []);

  async function signIn({ email, password }: SignInProps) {
    try {
      setLoadingAuth(true);
      console.log("Iniciando login...");

      const response = await api.post('/session', { email, password });
      console.log("Resposta do servidor:", response.data);

  const { id, name, token } = response.data as any;
  const userData: UserProps = { id, name, email, token };
      setUser(userData);

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      await AsyncStorage.setItem('@App:user', JSON.stringify(userData));
      await AsyncStorage.setItem('@App:token', token);

      setLoadingAuth(false);
      return userData;
    } catch (err: any) {
      setLoadingAuth(false);
      console.log(err.response?.data || err);
      Alert.alert('Erro', err.response?.data?.error || 'Não foi possível entrar');
      return null;
    }
  }

  async function signUp({ name, email, password }: SignUpProps) {
    try {
      setLoadingAuth(true);
      await api.post('/users', { name, email, password });
      const userData = await signIn({ email, password });
      setLoadingAuth(false);
      return userData;
    } catch (err: any) {
      setLoadingAuth(false);
      Alert.alert('Erro', err.response?.data?.error || 'Não foi possível cadastrar');
      return null;
    }
  }

  async function signOut() {
    try {
      // Chama a API para limpar pedidos em draft ao fazer logout
      await api.delete('/order/clear-draft');

      await AsyncStorage.clear();
      setUser(null);
    } catch (error) {
      console.log('Erro ao limpar pedidos em draft:', error);
      await AsyncStorage.clear();
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loadingAuth, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
