export function generateCacheKey(payload: any[]): string {
  return payload.map((p) => `${p.name}:${stableStringify(p.props)}`).join('|');
}

export function stableStringify(obj: any): string {
  return JSON.stringify(obj, Object.keys(obj).sort());
}