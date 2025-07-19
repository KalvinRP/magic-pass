export const defaultCacheProvider = {
    get(key) {
        const raw = sessionStorage.getItem(key);
        if (!raw)
            return null;
        try {
            const { value, expiry } = JSON.parse(raw);
            if (expiry && Date.now() > expiry) {
                sessionStorage.removeItem(key);
                return null;
            }
            return value;
        }
        catch {
            return null;
        }
    },
    set(key, value, ttlMs = 60000) {
        const expiry = Date.now() + ttlMs;
        sessionStorage.setItem(key, JSON.stringify({ value, expiry }));
    },
};
