export function defaultCacheManager(key, value) {
    if (value !== undefined) {
        sessionStorage.setItem(key, value);
    }
    return sessionStorage.getItem(key);
}
export function clearTokenCache(key) {
    sessionStorage.removeItem(key);
}
