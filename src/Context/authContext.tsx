'use client';

import React, { createContext, useContext, useEffect, useReducer } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface User {
    id: string;
    email: string;
    username: string;
    roles: string;
}

interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
}

type AuthAction =
    | { type: 'LOGIN_START' }
    | { type: 'LOGIN_SUCCESS'; payload: User }
    | { type: 'LOGIN_FAILURE'; payload: string }
    | { type: 'LOGOUT' };

interface AuthContextType extends AuthState {
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case 'LOGIN_START':
            return { ...state, loading: true, error: null };
        case 'LOGIN_SUCCESS':
            return { ...state, user: action.payload, loading: false, error: null };
        case 'LOGIN_FAILURE':
            return { ...state, user: null, loading: false, error: action.payload };
        case 'LOGOUT':
            return { ...state, user: null, loading: false, error: null };
        default:
            return state;
    }
};

const initialState: AuthState = {
    user: null,
    loading: false,
    error: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);
    const router = useRouter();

    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            fetchUser(token);
        }
    }, []);

    const fetchUser = async (token: string) => {
        dispatch({ type: 'LOGIN_START' });
        try {
            const response = await axios.get('/api/user', {
                headers: { Authorization: `Bearer ${token}` }
            });
            dispatch({ type: 'LOGIN_SUCCESS', payload: response.data.user });
        } catch (err) {
            dispatch({ type: 'LOGIN_FAILURE', payload: 'Failed to fetch user data' });
        }
    };

    const login = async (email: string, password: string) => {
        dispatch({ type: 'LOGIN_START' });
        try {
            const response = await axios.post('/api/token', { email, password }, {
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' }
            });
            const { user, token } = response.data;
            Cookies.set('token', token, { expires: 1 / 6 });
            dispatch({ type: 'LOGIN_SUCCESS', payload: user });
            
            if (user.roles.includes('admin')) {
                router.push('/admin');
            } else if (user.roles.includes('user')) {
                router.push('/user');
            } else {
                router.push('/guest');
            }
        } catch (err) {
            dispatch({ type: 'LOGIN_FAILURE', payload: 'Login failed' });
        }
    };

    const logout = () => {
        Cookies.remove('token');
        dispatch({ type: 'LOGOUT' });
        router.push('/');
    };

    return (
        <AuthContext.Provider value={{ ...state, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};