export interface AppSettings {
  id: string;
  name: string;
  logo: string;
  favicon: string;
  colors: {
    primary: string;
    secondary: string;
    navbar: {
      from: string;
      to: string;
    };
    sidebar: string;
  };
  security: {
    twoFactorAuth: {
      enabled: boolean;
      required: boolean;
      methods: ('email' | 'authenticator')[];
      validityPeriod: number;
    };
  };
  maintenance: {
    enabled: boolean;
    message: string;
    allowedRoles: ('coordinador_general')[];
    plannedEnd?: string;
  };
  updates: {
    githubRepo: string;
    lastUpdate: string | null;
    autoUpdate: boolean;
    branch: string;
  };
  updatedAt: string;
}