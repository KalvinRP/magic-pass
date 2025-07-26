export function defaultCacheManager(key: string, value?: string): string | null {
  if (value !== undefined) {
    sessionStorage.setItem(key, value);
  }
  return sessionStorage.getItem(key);
}

export function clearTokenCache(key: string) {
  sessionStorage.removeItem(key);
}