export type Role = 'admin' | 'user' | 'guest';

export interface User {
  id: string;
  name: string;
  email: string;
  roles: Role[]; // 複数のロールを持つことができるように変更
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  error: string | null;
}

export interface LoginResponse {
  user: User;
  token: string;
}