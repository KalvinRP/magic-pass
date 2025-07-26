import { ensureAutoHydrateLoaded } from '../utils/autoHydrate';
import { initializeGlobalRetryState, attachRetryClickListener } from '../utils/retry';
import {
    renderComponentSkeleton,
    filterUnhydratedComponents,
    hydrateComponent,
} from '../utils/render';
import { generateCacheKey } from '../utils/helpers';
import { getToken } from '../utils/token';
import { fetchTheBlueprint } from './fetchTheBlueprint';
import { defaultSkeleton } from '../utils/skeleton';
import { defaultCacheManager } from '../utils/cache';
import type { MagicPassOptions, RenderedComponent } from '../types';

export async function passComponents({
    components,
    mainEndpoint,
    hydrationOption,
    useToken,
    useReactHydration = false,
    manageCache = defaultCacheManager,
    manageSkeleton = defaultSkeleton,
}: MagicPassOptions) {
    if (hydrationOption.isBundled) {
        await ensureAutoHydrateLoaded(hydrationOption.bundledHydrationUrl, useReactHydration);
    }
    initializeGlobalRetryState();
    attachRetryClickListener();

    for (const component of components) {
        renderComponentSkeleton(component, manageSkeleton);
    }

    const targets = filterUnhydratedComponents(components);
    if (targets.length === 0) return;

    const payload = targets.map(({ componentName, props, containerId }) => ({
        name: componentName,
        props,
        containerId,
    }));

    const cacheKey = generateCacheKey(payload);

    let token: string | null = null;


    if (useToken?.mode === 'custom') {
        try {
            token = await useToken.getToken();
        } catch (err) {
            console.warn('[SSR] Custom token getter threw an error:', err);
            return;
        }
    } else if (useToken?.mode === 'default') {
        token = await getToken(cacheKey, { components: payload }, useToken.tokenEndpoint, manageCache);
        if (!token) {
            console.warn('[SSR] Token not available from default method, aborting rendering.');
            return;
        }
    }

    try {
        let response;
        if (!useToken) {
            response = await fetchTheBlueprint(
                mainEndpoint, null
            )
        } else {
            response = await fetchTheBlueprint(
                mainEndpoint,
                token,
                () => getToken(cacheKey, { components: payload }, useToken.tokenEndpoint, manageCache, true),
                useToken
            );
        }

        if (!response) return;

        const { rendered } = await response.json();

        await Promise.all(rendered.map((entry: RenderedComponent) =>
            hydrateComponent(entry, components, hydrationOption)
        ));

    } catch (error) {
        console.error('[SSR] Error rendering components:', error);
    }
}
