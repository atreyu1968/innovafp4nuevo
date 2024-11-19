import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '../stores/authStore';

describe('Auth Store', () => {
  beforeEach(() => {
    const store = useAuthStore.getState();
    store.logout();
  });

  it('should start with no authenticated user', () => {
    const store = useAuthStore.getState();
    expect(store.isAuthenticated).toBe(false);
    expect(store.user).toBeNull();
  });

  it('should authenticate user with valid credentials', async () => {
    const store = useAuthStore.getState();
    await store.login('gestor@fp.edu.es', 'password');
    expect(store.isAuthenticated).toBe(true);
    expect(store.user).toBeTruthy();
    expect(store.user?.role).toBe('gestor');
  });

  it('should reject invalid credentials', async () => {
    const store = useAuthStore.getState();
    await expect(store.login('invalid@email.com', 'wrong')).rejects.toThrow();
    expect(store.isAuthenticated).toBe(false);
    expect(store.user).toBeNull();
  });

  it('should logout user', async () => {
    const store = useAuthStore.getState();
    await store.login('gestor@fp.edu.es', 'password');
    expect(store.isAuthenticated).toBe(true);
    
    store.logout();
    expect(store.isAuthenticated).toBe(false);
    expect(store.user).toBeNull();
  });
});