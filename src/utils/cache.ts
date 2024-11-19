import { get, set, del } from 'idb-keyval';

export const cache = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const cached = await get(key);
      if (!cached) return null;

      const { value, expiresAt } = cached as { value: T; expiresAt: number };
      if (Date.now() > expiresAt) {
        await del(key);
        return null;
      }

      return value;
    } catch (error) {
      console.error('Error accessing cache:', error);
      return null;
    }
  },

  async set<T>(key: string, value: T, ttl = 3600000): Promise<void> {
    try {
      await set(key, {
        value,
        expiresAt: Date.now() + ttl,
      });
    } catch (error) {
      console.error('Error setting cache:', error);
    }
  },

  async clear(key?: string): Promise<void> {
    try {
      if (key) {
        await del(key);
      } else {
        // Clear all cache
        const keys = await get('keys');
        if (Array.isArray(keys)) {
          await Promise.all(keys.map(k => del(k)));
        }
      }
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }
};