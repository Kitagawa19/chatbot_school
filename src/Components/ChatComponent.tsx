'use client';
import React, { useState, FormEvent } from 'react';
import useSWR from 'swr';
import { useAuth } from '../Context/authContext';

interface Message {
    id: string;
    content: string;
    sender: string;
    timestamp: string;
}

const fetcher = (url: string): Promise<Message[]> => fetch(url).then((res) => res.json());

const ChatComponent: React.FC = () => {
    const { user } = useAuth();
    const [message, setMessage] = useState<string>('');
    const { data: messages, error, mutate } = useSWR<Message[]>('/api/messages', fetcher, {
        refreshInterval: 1000,
    });

    const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!message.trim() || !user) return;

        try {
            const response = await fetch('/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: message, sender: user.id }),
            });

            if (response.ok) {
                setMessage('');
                mutate();
            }
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    if (error) return <div>Failed to load messages</div>;
    if (!messages) return <div>Loading...</div>;

    return (
        <div>
            <div>
                {messages.map((msg: Message) => (
                    <div key={msg.id}>
                        <strong>{msg.sender}: </strong>
                        {msg.content}
                        <small>{new Date(msg.timestamp).toLocaleString()}</small>
                    </div>
                ))}
            </div>
            <form onSubmit={sendMessage}>
                <input
                    type="text"
                    value={message}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default ChatComponent;