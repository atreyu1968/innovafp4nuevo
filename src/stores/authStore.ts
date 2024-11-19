import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, User } from '../types/auth';

const mockUsers: User[] = [
  {
    id: '1',
    email: 'gestor@fp.edu.es',
    nombre: 'Juan Pérez',
    role: 'gestor',
    centro: 'IES Example',
    subred: 'Madrid-Norte',
  },
  {
    id: '2',
    email: 'coordinador@fp.edu.es',
    nombre: 'María García',
    role: 'coordinador_subred',
    subred: 'Madrid-Norte',
  },
  {
    id: '3',
    email: 'admin@fp.edu.es',
    nombre: 'Carlos López',
    role: 'coordinador_general',
  },
];

interface ExtendedAuthState extends AuthState {
  activeRole: 'admin' | 'coordinator' | null;
  setActiveRole: (role: 'admin' | 'coordinator') => void;
}

export const useAuthStore = create<ExtendedAuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      activeRole: null,
      login: async (email: string, password: string) => {
        const user = mockUsers.find((u) => u.email === email);
        if (user) {
          set({ 
            user, 
            isAuthenticated: true,
            activeRole: user.role === 'coordinador_general' ? 'admin' : null
          });
        } else {
          throw new Error('Credenciales inválidas');
        }
      },
      logout: () => {
        set({ user: null, isAuthenticated: false, activeRole: null });
      },
      updateUserProfile: async (updates) => {
        const currentUser = get().user;
        if (!currentUser) throw new Error('No hay usuario autenticado');

        // En una aplicación real, aquí se haría una llamada a la API
        set({
          user: {
            ...currentUser,
            ...updates,
          },
        });
      },
      setActiveRole: (role) => {
        set({ activeRole: role });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);