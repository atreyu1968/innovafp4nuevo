export interface BackupConfig {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string; // HH:mm format
  dayOfWeek?: number; // 0-6 for weekly backups
  dayOfMonth?: number; // 1-31 for monthly backups
  includeData: {
    forms: boolean;
    responses: boolean;
    users: boolean;
    dashboards: boolean;
    reports: boolean;
    network: boolean;
    settings: boolean;
  };
  retention: number; // Number of backups to keep
  createdAt: string;
  lastBackup?: string;
  nextBackup?: string;
}

export interface Backup {
  id: string;
  configId: string;
  timestamp: string;
  size: number;
  data: {
    forms?: any[];
    responses?: any[];
    users?: any[];
    dashboards?: any[];
    reports?: any[];
    network?: any[];
    settings?: any;
  };
}