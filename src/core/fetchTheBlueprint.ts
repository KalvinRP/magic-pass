import { UseTokenOption } from '../types';

export async function fetchTheBlueprint(
  endpoint: string,
  token: string | null,
  retryGetToken?: () => Promise<string | null>,
  useToken?: UseTokenOption
): Promise<Response | null> {
  const headers: Record<string, string> = {};
  if (!token) {
    return fetch(endpoint); // no token used at all
  }

  if (useToken?.useAsAuth) {
    headers['Authorization'] = token;
  }

  const buildUrl = (tk: string) =>
    useToken?.useAsParams
      ? `${endpoint}?${useToken.useAsParams}=${encodeURIComponent(tk)}`
      : endpoint;

  let res = await fetch(buildUrl(token), { headers });

  if (res.status === 401 && retryGetToken) {
    console.warn('[SSR] Token expired, retrying...');
    const newToken = await retryGetToken();
    if (!newToken) return null;

    // Buat headers baru
    const newHeaders: Record<string, string> = {};
    if (useToken?.useAsAuth) {
      newHeaders['Authorization'] = newToken;
    }

    res = await fetch(buildUrl(newToken), { headers: newHeaders });
  }

  if (!res.ok) {
    throw new Error(`[SSR] Failed to fetch: ${res.status} ${res.statusText}`);
  }

  return res;
}
