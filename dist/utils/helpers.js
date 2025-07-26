export function generateCacheKey(payload) {
    return payload.map((p) => `${p.name}:${stableStringify(p.props)}`).join('|');
}
export function stableStringify(obj) {
    return JSON.stringify(obj, Object.keys(obj).sort());
}
