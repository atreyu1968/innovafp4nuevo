import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CacheState {
  cache: { [key: string]: any };
  setCache: (key: string, value: any, ttl?: number) => void;
  getCache: (key: string) => any;
  clearCache: (key?: string) => void;
}

export const useCacheStore = create<CacheState>()(
  persist(
    (set, get) => ({
      cache: {},
      setCache: (key, value, ttl = 3600000) => { // Default TTL: 1 hour
        const expiresAt = Date.now() + ttl;
        set((state) => ({
          cache: {
            ...state.cache,
            [key]: { value, expiresAt },
          },
        }));
      },
      getCache: (key) => {
        const cached = get().cache[key];
        if (!cached) return null;
        
        if (Date.now() > cached.expiresAt) {
          get().clearCache(key);
          return null;
        }
        
        return cached.value;
      },
      clearCache: (key) => {
        if (key) {
          set((state) => {
            const newCache = { ...state.cache };
            delete newCache[key];
            return { cache: newCache };
          });
        } else {
          set({ cache: {} });
        }
      },
    }),
    {
      name: 'app-cache',
    }
  )
);