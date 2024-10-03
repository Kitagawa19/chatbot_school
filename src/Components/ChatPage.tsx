'use client';
import React, { useState, useEffect, FormEvent } from 'react';
import useSWR from 'swr';
import { useAuth } from '../Context/authContext';

interface Message {
    id: string;
    content: string;
    sender: string;
    timestamp: string;
}

const fetcher = (url: string, token: string | null) => {
    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, 
        },
    }).then((res) => {
        if (!res.ok) {
            throw new Error('Failed to fetch');
        }
        return res.json();
    });
};

export const ChatComponent: React.FC = () => {
    const { token, user } = useAuth();
    const [message, setMessage] = useState<string>('');
    const [authToken, setAuthToken] = useState<string | null>(null);  
    useEffect(() => {
        if (token) {
            setAuthToken(token);
        }
    }, [token]);

    // トークンが存在する場合にのみSWRを実行
    const { data: messages = [], error, mutate } = useSWR<Message[]>(
        authToken ? ['http://localhost:7071/api/app/view/chat/', authToken] : null, 
        ([url, token]) => fetcher(url, token as string), 
    );

    const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Sending message:', message);
        if (!message.trim() || !user || !authToken) return;

        const optimisticMessage: Message = {
            id: Date.now().toString(),
            content: message,
            sender: user.id,
            timestamp: new Date().toISOString(),
        };

        const originalMessages = messages ? [...messages] : [];

        mutate([...messages, optimisticMessage], false);

        setMessage('');

        try {
            const response = await fetch('http://localhost:7071/api/app/input/chat/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify({ content: message, sender: user.id }),
            });

            if (response.ok) {
                mutate();
            } else {
                mutate(originalMessages, false);
                console.error('Failed to send message');
            }
        } catch (error) {
            mutate(originalMessages, false);
            console.error('Failed to send message:', error);
        }
    };

    if (error) return <div>Failed to load messages</div>;
    if (!messages) return <div>Loading...</div>;

    return (
        <div className="chat-container">
            <div className="message-list">
                {messages.map((msg: Message) => (
                    <div key={msg.id} className={`message ${msg.sender === user?.id ? 'sent' : 'received'}`}>
                        <strong>{msg.sender === user?.id ? 'You' : msg.sender}: </strong>
                        {msg.content}
                        <small>{new Date(msg.timestamp).toLocaleString()}</small>
                    </div>
                ))}
            </div>
            <form onSubmit={sendMessage} className="message-form">
                <input
                    id='message-input'
                    name='message'
                    type="text"
                    value={message}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="message-input"
                />
                <button type="submit" className="send-button">Send</button>
            </form>
        </div>
    );
};
