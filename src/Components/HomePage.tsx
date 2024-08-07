import React from 'react';
import { useAuth } from '@/Context/authContext';
import LoginForm from '@/Components/LoginForm';
import ChatComponent from '@/Components/ChatComponent';

const HomePage: React.FC = () => {
    const { user } = useAuth();

    return (
        <div>
            <h1>Welcome to Our Chat App</h1>
            {user ? (
                <>
                    <p>Hello, {user.username}!</p>
                    <ChatComponent />
                </>
            ) : (
                <>
                    <p>Please log in to start chatting.</p>
                    <LoginForm />
                </>
            )}
        </div>
    );
};

export default HomePage;