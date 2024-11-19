import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BackupConfig, Backup } from '../types/backup';
import { useFormStore } from './formStore';
import { useUserStore } from './userStore';
import { useDashboardStore } from './dashboardStore';
import { useReportStore } from './reportStore';
import { useNetworkStore } from './networkStore';
import { useSettingsStore } from './settingsStore';

interface BackupState {
  configs: BackupConfig[];
  backups: Backup[];
  addConfig: (config: Omit<BackupConfig, 'id' | 'createdAt'>) => void;
  updateConfig: (id: string, updates: Partial<BackupConfig>) => void;
  deleteConfig: (id: string) => void;
  createBackup: (configId: string) => Promise<void>;
  restoreBackup: (backupId: string) => Promise<void>;
  deleteBackup: (backupId: string) => void;
  getNextBackupTime: (config: BackupConfig) => Date;
}

export const useBackupStore = create<BackupState>()(
  persist(
    (set, get) => ({
      configs: [],
      backups: [],

      addConfig: (configData) => {
        const config: BackupConfig = {
          ...configData,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          nextBackup: get().getNextBackupTime(configData as BackupConfig).toISOString(),
        };
        set((state) => ({
          configs: [...state.configs, config],
        }));
      },

      updateConfig: (id, updates) => {
        set((state) => ({
          configs: state.configs.map((config) =>
            config.id === id
              ? {
                  ...config,
                  ...updates,
                  nextBackup: get().getNextBackupTime({
                    ...config,
                    ...updates,
                  }).toISOString(),
                }
              : config
          ),
        }));
      },

      deleteConfig: (id) => {
        set((state) => ({
          configs: state.configs.filter((config) => config.id !== id),
          backups: state.backups.filter((backup) => backup.configId !== id),
        }));
      },

      createBackup: async (configId) => {
        const config = get().configs.find((c) => c.id === configId);
        if (!config) return;

        const data: any = {};
        
        if (config.includeData.forms) {
          data.forms = useFormStore.getState().forms;
          data.responses = useFormStore.getState().responses;
        }
        
        if (config.includeData.users) {
          data.users = useUserStore.getState().users;
        }
        
        if (config.includeData.dashboards) {
          data.dashboards = useDashboardStore.getState().dashboards;
        }
        
        if (config.includeData.reports) {
          data.reports = useReportStore.getState().reports;
        }
        
        if (config.includeData.network) {
          const networkStore = useNetworkStore.getState();
          data.network = {
            subnets: networkStore.subnets,
            centers: networkStore.centers,
            families: networkStore.families,
          };
        }
        
        if (config.includeData.settings) {
          data.settings = useSettingsStore.getState().settings;
        }

        const backup: Backup = {
          id: crypto.randomUUID(),
          configId,
          timestamp: new Date().toISOString(),
          size: new Blob([JSON.stringify(data)]).size,
          data,
        };

        // Mantener solo el número de backups especificado en retention
        const configBackups = get().backups
          .filter((b) => b.configId === configId)
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        if (configBackups.length >= config.retention) {
          const backupsToDelete = configBackups.slice(config.retention - 1);
          set((state) => ({
            backups: state.backups.filter(
              (b) => !backupsToDelete.find((del) => del.id === b.id)
            ),
          }));
        }

        set((state) => ({
          backups: [...state.backups, backup],
          configs: state.configs.map((c) =>
            c.id === configId
              ? {
                  ...c,
                  lastBackup: backup.timestamp,
                  nextBackup: get().getNextBackupTime(c).toISOString(),
                }
              : c
          ),
        }));
      },

      restoreBackup: async (backupId) => {
        const backup = get().backups.find((b) => b.id === backupId);
        if (!backup) return;

        if (backup.data.forms) {
          useFormStore.setState({
            forms: backup.data.forms,
            responses: backup.data.responses,
          });
        }

        if (backup.data.users) {
          useUserStore.setState({ users: backup.data.users });
        }

        if (backup.data.dashboards) {
          useDashboardStore.setState({ dashboards: backup.data.dashboards });
        }

        if (backup.data.reports) {
          useReportStore.setState({ reports: backup.data.reports });
        }

        if (backup.data.network) {
          useNetworkStore.setState({
            subnets: backup.data.network.subnets,
            centers: backup.data.network.centers,
            families: backup.data.network.families,
          });
        }

        if (backup.data.settings) {
          useSettingsStore.setState({ settings: backup.data.settings });
        }
      },

      deleteBackup: (backupId) => {
        set((state) => ({
          backups: state.backups.filter((backup) => backup.id !== backupId),
        }));
      },

      getNextBackupTime: (config) => {
        const now = new Date();
        const [hours, minutes] = config.time.split(':').map(Number);
        const next = new Date(now);
        next.setHours(hours, minutes, 0, 0);

        if (next <= now) {
          next.setDate(next.getDate() + 1);
        }

        switch (config.frequency) {
          case 'weekly':
            while (next.getDay() !== config.dayOfWeek) {
              next.setDate(next.getDate() + 1);
            }
            break;

          case 'monthly':
            next.setDate(config.dayOfMonth || 1);
            if (next <= now) {
              next.setMonth(next.getMonth() + 1);
            }
            break;
        }

        return next;
      },
    }),
    {
      name: 'backup-storage',
    }
  )
);