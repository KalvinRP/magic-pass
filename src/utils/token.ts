import { clearTokenCache, defaultCacheManager } from './cache';
import type { UseTokenOption } from '../types';

export async function getToken(
  key: string,
  payload: any,
  endpoint: string,
  cache = defaultCacheManager,
  bypassCache: boolean = false
): Promise<string | null> {
  if (!bypassCache) {
    const cached = cache(key);
    if (cached) return cached;
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ components: payload.components }),
  });

  if (!res.ok) return null;

  const { token } = await res.json();
  if (!token) return null;

  cache(key, token);
  return token;
}
