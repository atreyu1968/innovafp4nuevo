export type UserRole = 'gestor' | 'coordinador_subred' | 'coordinador_general';

export interface User {
  id: string;
  email: string;
  nombre: string;
  role: UserRole;
  centro?: string;
  subred?: string;
  photo?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserProfile: (updates: { photo?: string; password?: string }) => Promise<void>;
}