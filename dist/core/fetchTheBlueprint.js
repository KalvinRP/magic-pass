export async function fetchTheBlueprint(endpoint, token, retryGetToken, useToken) {
    const headers = {};
    if (!token) {
        return fetch(endpoint); // no token used at all
    }
    if (useToken?.useAsAuth) {
        headers['Authorization'] = token;
    }
    const buildUrl = (tk) => useToken?.useAsParams
        ? `${endpoint}?${useToken.useAsParams}=${encodeURIComponent(tk)}`
        : endpoint;
    let res = await fetch(buildUrl(token), { headers });
    if (res.status === 401 && retryGetToken) {
        console.warn('[SSR] Token expired, retrying...');
        const newToken = await retryGetToken();
        if (!newToken)
            return null;
        // Buat headers baru
        const newHeaders = {};
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
