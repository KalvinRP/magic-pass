import type { CacheProvider } from '../shared/types';

export const defaultCacheProvider: CacheProvider = {
  get(key: string): string | null {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;

    try {
      const { value, expiry } = JSON.parse(raw);
      if (expiry && Date.now() > expiry) {
        sessionStorage.removeItem(key);
        return null;
      }
      return value;
    } catch {
      return null;
    }
  },

  set(key: string, value: string, ttlMs = 60000): void {
    const expiry = Date.now() + ttlMs;
    sessionStorage.setItem(key, JSON.stringify({ value, expiry }));
  },
};
