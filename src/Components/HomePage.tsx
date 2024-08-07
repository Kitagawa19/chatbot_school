'use client';
import React from 'react';
import { LoginForm } from './parts/Login';


export const HomePage: React.FC = () => {
    return (
        <div>
            <h1>Welcome to Our Chat App</h1>
            <>
                <p>Please log in to start chatting.</p>
                <LoginForm />
            </>
        </div>
    );
};