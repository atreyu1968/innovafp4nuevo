export interface User {
  // Previous properties...
  password?: string;
  mustChangePassword?: boolean;
  twoFactorEnabled?: boolean;
  lastPasswordChange?: string;
}