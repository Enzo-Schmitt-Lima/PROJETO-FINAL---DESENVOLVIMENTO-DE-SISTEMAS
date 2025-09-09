// // nesse codigo, tem loadingAuth; nao tenho certeza se tinha no codigo gabarito, mas devido à grande quantidade de erros, optei pela solução do ChatGPT
// // também nao tenho certeza se "import asyncstorage" faz parte do gabarito, mas novamente optei pela solução da IA


import React, { useState, createContext, ReactNode, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from '../services/api'

type AuthContextData = {
    user: UserProps;
    isAuthenticated: boolean;
    signIn: (credentials: SignInProps) => Promise<void>;
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
    const [user, setUser] = useState<UserProps>({
        id: '',
        name: '',
        email: '',
        token: ''
    });

    const [loadingAuth, setLoadingAuth] = useState(false);
    const [loading, setLoading] = useState(true);

    const isAuthenticated = !!user.name;

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

    async function signIn({ email, password }: SignInProps) {
        setLoadingAuth(true);
        try {
            const response = await api.post('/session', { email, password });
            const { id, name, token } = response.data;

            const data = { id, name, email, token };
            await AsyncStorage.setItem('@sujeitopizzaria', JSON.stringify(data));
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUser(data);

        } catch (err) {
            console.log('Erro ao acessar', err);
            alert("Erro ao fazer login, verifique suas credenciais.");
        } finally {
        setLoadingAuth(false);
    }
}

    async function signOut() {
        await AsyncStorage.clear();
        setUser({ id: '', name: '', email: '', token: '' });
    }

    async function signUp({ name, email, password }: SignUpProps) {
        setLoadingAuth(true);
        try {
            await api.post('/users', { name, email, password });
            alert("Cadastro realizado com sucesso!")

        } catch (err) {
            console.log("Erro ao cadastrar:", err);
            alert("Erro ao cadastrar, tente novamente!");
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
