export interface SSRComponent {
    name: string;
    props: Record<string, any>;
    containerId: string;
}
export interface SSRClientConfig {
    ssrEndpoint: string;
    hydrateScriptUrl: string;
    useJWT?: boolean;
    getToken?: (components: SSRComponent[]) => Promise<string>;
    cacheProvider?: CacheProvider;
    sanitize?: boolean;
    getSkeleton?: (component: SSRComponent) => string;
}
export interface CacheProvider {
    get(key: string): string | null;
    set(key: string, value: string, ttlMs?: number): void;
}
