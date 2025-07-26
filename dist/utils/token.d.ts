import { defaultCacheManager } from './cache';
export declare function getToken(key: string, payload: any, endpoint: string, cache?: typeof defaultCacheManager): Promise<string | null>;
