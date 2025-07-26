export interface ComponentDef {
  componentName: string;
  props: Record<string, any>;
  containerId: string;
}

export interface UseTokenOption {
  mode: 'custom' | 'default';
  getToken: () => Promise<string>;
  tokenEndpoint: string;
  useAsAuth?: boolean;
  useAsParams?: string;
}

export type SkeletonRenderer = (component: ComponentDef, timeoutMs: number) => string;
export type CacheManager = (key: string, value?: string) => string | null;

export interface MagicPassOptions {
  components: ComponentDef[];
  mainEndpoint: string;
  hydrationEndpoint: string;
  useToken?: UseTokenOption;
  useReactHydration?: boolean;
  manageCache?: CacheManager;
  manageSkeleton?: SkeletonRenderer;
}

export interface RenderedComponent {
  name: string;
  html: string;
  containerId: string;
  error?: string;
}
