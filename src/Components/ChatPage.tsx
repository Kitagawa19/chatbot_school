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

// サンプルメッセージ
const sampleMessages: Message[] = [
  { id: '1', content: 'こんにちは！', sender: 'user1', timestamp: '2024-03-15T09:00:00Z' },
  { id: '2', content: 'お元気ですか？', sender: 'ai', timestamp: '2024-03-15T09:01:00Z' },
  { id: '3', content: 'はい、元気です！', sender: 'user1', timestamp: '2024-03-15T09:02:00Z' },
];

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
    if (!message.trim() || !authToken) return;

    const optimisticMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: user?.id || 'user1',
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
        body: JSON.stringify({ content: message, sender: optimisticMessage.sender }),
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

  // ログインしていない場合はサンプルメッセージを使用
  const displayedMessages = user ? messages : sampleMessages;

  return (
    <Container maxWidth="sm" sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2 }}>
        <List>
          {displayedMessages.map((msg: Message) => (
            <ListItem
            key={msg.id}
            sx={{ justifyContent: msg.sender === (user?.id || 'user1') ? 'flex-end' : 'flex-start' }}
          >
            <Box sx={{ maxWidth: '75%', position: 'relative' }}>
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  backgroundColor: msg.sender === (user?.id || 'user1') ? '#3b82f6' : '#e5e7eb', 
                  color: msg.sender === (user?.id || 'user1') ? '#ffffff' : '#1f2937',
                  textAlign: msg.sender === (user?.id || 'user1') ? 'center' : 'center',
                  position: 'relative',
                  borderRadius: '20px',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    borderWidth: '10px',
                    borderStyle: 'solid',
                    borderColor:
                      msg.sender === (user?.id || 'user1')
                        ? 'transparent transparent transparent #3b82f6'
                        : 'transparent #e5e7eb transparent transparent',
                    right: msg.sender === (user?.id || 'user1') ? '-20px' : 'auto',
                    left: msg.sender !== (user?.id || 'user1') ? '-20px' : 'auto',
                  },
                }}
              >
                <ListItemText primary={msg.content} sx={{ wordWrap: 'break-word' }} />
              </Paper>
            </Box>
          </ListItem>
          ))}
        </List>
      </Box>
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
          送信
        </Button>
      </Box>
    </Container>
  );
};
