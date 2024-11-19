import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppSettings } from '../types/settings';

interface SettingsState {
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;
  checkForUpdates: () => Promise<{ hasUpdates: boolean; latestCommit?: string }>;
  performUpdate: () => Promise<boolean>;
}

const defaultSettings: AppSettings = {
  id: '1',
  name: 'Red de Innovación FP',
  logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Logotipo_del_Gobierno_de_Canarias.svg/1200px-Logotipo_del_Gobierno_de_Canarias.svg.png',
  favicon: 'https://pbs.twimg.com/profile_images/1634182493648691204/sY2uIjHE_400x400.jpg',
  colors: {
    primary: '#2563eb',
    secondary: '#1e40af',
    navbar: {
      from: '#1e3a8a',
      to: '#1e40af',
    },
    sidebar: '#ebf5ff',
  },
  security: {
    twoFactorAuth: {
      enabled: false,
      required: false,
      methods: ['email', 'authenticator'],
      validityPeriod: 5
    }
  },
  maintenance: {
    enabled: false,
    message: 'El sistema se encuentra en mantenimiento. Por favor, inténtelo más tarde.',
    allowedRoles: ['coordinador_general'],
    plannedEnd: undefined
  },
  updates: {
    githubRepo: '',
    lastUpdate: null,
    autoUpdate: false,
    branch: 'main'
  },
  updatedAt: new Date().toISOString(),
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      settings: defaultSettings,
      
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: {
            ...state.settings,
            ...newSettings,
            updatedAt: new Date().toISOString(),
          },
        })),

      checkForUpdates: async () => {
        const { settings } = get();
        if (!settings.updates?.githubRepo) {
          throw new Error('No se ha configurado un repositorio de GitHub');
        }

        try {
          const [owner, repo] = settings.updates.githubRepo.split('/');
          const response = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/commits/${settings.updates.branch}`
          );
          
          if (!response.ok) {
            throw new Error('Error al verificar actualizaciones');
          }

          const data = await response.json();
          const latestCommit = data.sha;
          const hasUpdates = latestCommit !== settings.updates.lastUpdate;

          return { hasUpdates, latestCommit };
        } catch (error) {
          console.error('Error checking for updates:', error);
          throw error;
        }
      },

      performUpdate: async () => {
        const { settings } = get();
        if (!settings.maintenance?.enabled) {
          throw new Error('El modo mantenimiento debe estar activo para actualizar');
        }

        try {
          const { latestCommit } = await get().checkForUpdates();
          
          // Aquí iría la lógica de actualización real
          // Por ahora solo actualizamos el timestamp
          set((state) => ({
            settings: {
              ...state.settings,
              updates: {
                ...state.settings.updates,
                lastUpdate: latestCommit
              }
            }
          }));

          return true;
        } catch (error) {
          console.error('Error performing update:', error);
          throw error;
        }
      },
    }),
    {
      name: 'settings-storage',
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          return {
            ...persistedState,
            settings: {
              ...persistedState.settings,
              updates: {
                ...defaultSettings.updates,
                ...persistedState.settings?.updates,
              }
            }
          };
        }
        return persistedState;
      },
    }
  )
);