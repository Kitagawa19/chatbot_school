'use client';

import React, { useEffect, useContext, useReducer, createContext } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface AuthState {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
}

interface User {
    id: string;
    email: string;
    username: string;
    roles: string[];
}

const initState: AuthState = {
    user: null,
    token: null,
    loading: false,
    error: null,
};

type Action =
    | { type: 'LOGIN_START' }
    | { type: 'LOGOUT' }
    | { type: 'LOGIN_SUCCESS'; payload: { user: User, token: string } }
    | { type: 'LOGIN_FAILED'; payload: string }; // error message in payload

function authReducer(state: AuthState, action: Action): AuthState {
    switch (action.type) {
        case 'LOGIN_START':
            return {
                ...state,
                loading: true,
                error: null
            };
        case 'LOGOUT':
            return {
                ...state,
                user: null,
                token: null
            };
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                loading: false,
                error: null
            };
        case 'LOGIN_FAILED':
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        default:
            return state;
    }
}

interface AuthStateProps {
    user: User | null;
    login: (email: string, password: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthStateProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(authReducer, initState);
    const router = useRouter();

    const login = async (email: string, password: string) => {
        dispatch({ type: 'LOGIN_START' });
        try {
            const response = await axios.post('/api/token', {
                email,
                password
            }, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const { user, token } = response.data;
            Cookies.set('token', token, { expires: 1 / 6 });
            dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
            
            // ロールに応じたリダイレクト
            if (user.roles.includes('admin')) {
                router.push('/admin');
            } else if (user.roles.includes('user')) {
                router.push('/user');
            } else {
                router.push('/guest');
            }
        } catch (err) {
            dispatch({ type: 'LOGIN_FAILED', payload: 'Login failed!' });
        }
    };

    const logout = () => {
        Cookies.remove('token');
        dispatch({ type: 'LOGOUT' });
        router.push('/');
    };

    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            axios.get('/api/user', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(response => {
                dispatch({ type: 'LOGIN_SUCCESS', payload: { user: response.data.user, token } });
            }).catch(err => {
                dispatch({ type: 'LOGIN_FAILED', payload: 'Login failed!' });
            });
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user: state.user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within a AuthProvider');
    }
    return context;
};
