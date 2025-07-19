import type { SSRComponent, SSRClientConfig } from '../shared/types';
export declare function loadMultiSSRComponents(config: SSRClientConfig & {
    components: SSRComponent[];
}): Promise<void>;
