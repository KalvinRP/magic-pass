export interface SSRComponent {
  name: string;
  props: Record<string, any>;
  containerId: string;
}

export interface SSRClientConfig {
  ssrEndpoint: string;
  hydrateScriptUrl: string;
  cacheProvider?: CacheProvider;
  sanitize?: boolean;
  useJWT?: JWTOptions;
  getSkeleton?: (component: SSRComponent) => string;
}

export interface CacheProvider {
  get(key: string): string | null;
  set(key: string, value: string, ttlMs?: number): void;
}

export interface JWTOptions {
  active: boolean;
  getToken?: (components: SSRComponent[]) => Promise<string>;
  asAuthHeader?: boolean;
  keyParams?: string;
}