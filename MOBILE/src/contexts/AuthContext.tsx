import React, { useState, createContext, ReactNode, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api  from '../services/api';

type AuthContextData = {
    user: UserProps | null;
    isAuthenticated: boolean;
    signIn: (credentials: SignInProps) => Promise<UserProps | void>;
    signUp: (credentials: SignUpProps) => Promise<void>;
    loadingAuth: boolean;
    loading: boolean;
    signOut: () => Promise<void>;
}

type UserProps = {
    id: string;
    name: string;
    email: string;
    token: string;
}

type AuthProviderProps = {
    children: ReactNode;
}

type SignInProps = {
    email: string;
    password: string;
}

type SignUpProps = {
    name: string;
    email: string;
    password: string;
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<UserProps | null>(null);
    const [loadingAuth, setLoadingAuth] = useState(false);
    const [loading, setLoading] = useState(true);

    const isAuthenticated = !!user;

    useEffect(() => {
        async function getUser() {
            const userInfo = await AsyncStorage.getItem('@sujeitopizzaria');
            const hasUser: UserProps = JSON.parse(userInfo || '{}');

            if (Object.keys(hasUser).length > 0) {
                api.defaults.headers.common['Authorization'] = `Bearer ${hasUser.token}`;
                setUser(hasUser);
            }

            setLoading(false);
        }
        getUser();
    }, []);

    async function signIn({ email, password }: SignInProps): Promise<UserProps | void> {
        setLoadingAuth(true);
        try {
            const response = await api.post('/session', { email, password });
            const { id, name, email: userEmail, token } = response.data;
            const data = { id, name, email: userEmail, token };

            await AsyncStorage.setItem('@sujeitopizzaria', JSON.stringify(data));
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUser(data);
            
            return data;
        } catch (err) {
            console.log('Erro ao acessar', err);
        } finally {
            setLoadingAuth(false);
        }
    }

    async function signOut() {
        await AsyncStorage.clear();
        setUser(null);
    }

    async function signUp({ name, email, password }: SignUpProps) {
        setLoadingAuth(true);
        try {
            await api.post('/users', { name, email, password });
        } catch (err) {
            console.log("Erro ao cadastrar:", err);
        } finally {
            setLoadingAuth(false);
        }
    }

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            signIn,
            signUp,
            loading,
            loadingAuth,
            signOut
        }}>
            {children}
        </AuthContext.Provider>
    );
}
