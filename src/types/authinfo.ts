export interface User {
    id: string;
    name: string;
    email: string;
  }
  
  export type Role = 'admin' | 'user' | 'guest';
  
  export interface AuthState {
    user: User | null;
    role: Role | null;
    isAuthenticated: boolean;
    error: string | null;
  }
  
  export interface LoginResponse {
    user: User;
    role: Role;
    token: string;
  }