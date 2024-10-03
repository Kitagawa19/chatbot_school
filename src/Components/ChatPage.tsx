'use client';
import React, { useState, useEffect, FormEvent } from 'react';
import useSWR from 'swr';
import { useAuth } from '../Context/authContext';
import { 
    Box, 
    Container, 
    TextField, 
    Button, 
    Typography, 
    List, 
    ListItem, 
    ListItemText, 
    Paper 
} from '@mui/material';

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

    if (error) return <Typography color="error">Failed to load messages</Typography>;
    if (!messages) return <Typography>Loading...</Typography>;

    return (
        <Container maxWidth="sm" sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Message list area */}
            <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2 }}>
                <List>
                    {messages.map((msg: Message) => (
                        <ListItem
                            key={msg.id}
                            sx={{ justifyContent: msg.sender === user?.id ? 'flex-end' : 'flex-start' }}
                        >
                            <Box sx={{ maxWidth: '75%' }}>
                                <Paper
                                    elevation={1}
                                    sx={{
                                        p: 1,
                                        backgroundColor: msg.sender === user?.id ? '#e0f7fa' : '#fff',
                                    }}
                                >
                                    <ListItemText
                                        primary={msg.content}
                                        secondary={new Date(msg.timestamp).toLocaleString()}
                                        sx={{ wordWrap: 'break-word' }}
                                    />
                                </Paper>
                            </Box>
                        </ListItem>
                    ))}
                </List>
            </Box>

            {/* Input area - Fixed at the bottom */}
            <Box component="form" onSubmit={sendMessage} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TextField
                    id="message-input"
                    name="message"
                    fullWidth
                    variant="outlined"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)}
                    sx={{ mr: 2 }}
                />
                <Button type="submit" variant="contained" color="primary">
                    Send
                </Button>
            </Box>
        </Container>
    );
};
