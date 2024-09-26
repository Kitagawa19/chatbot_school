'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

// コンテキストの型定義
interface AuthContextType {
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  token: string | null;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // ログイン関数
  const login = async (username: string, password: string) => {
    try {
      // FastAPIにPOSTリクエストを送信して、トークンを取得
      const response = await axios.post("http://localhost:7071/api/login/", {
        username,
        password,
      }, {
        withCredentials: true, 
        headers: {
          "Content-Type": "application/json",
        },
      });

      const accessToken = response.data.access_token;
      setToken(accessToken);  // トークンを状態にセット
      localStorage.setItem('authToken', accessToken);  // トークンをlocalStorageに保存
      setError(null);  // エラーをクリア
      router.push('/Chat');  // ログイン成功後にダッシュボードに遷移
    } catch (err) {
      setError('Invalid username or password');  // バックエンドからのエラーメッセージに対応
      console.error("Login failed:", err);
    }
  };

  // ログアウト関数
  const logout = () => {
    setToken(null);
    localStorage.removeItem('authToken');  // ローカルストレージからトークンを削除
    router.push('/login');  // ログアウト後にログインページに遷移
  };

  const value = {
    login,
    logout,
    token,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// フックを使ってコンテキストを利用する
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
