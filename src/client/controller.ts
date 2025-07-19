import type { SSRComponent, SSRClientConfig } from '../shared/types';
import { defaultCacheProvider } from './caching';
import { sanitizeHTML } from '../shared/sanitize';
import { defaultSkeleton } from '../shared/dummy';

export async function loadMultiSSRComponents(config: SSRClientConfig & {
  components: SSRComponent[];
}) {
  const {
    components,
    ssrEndpoint,
    hydrateScriptUrl,
    cacheProvider = defaultCacheProvider,
    sanitize = false,
    useJWT = {active: false},
    getSkeleton = defaultSkeleton
  } = config;

  components.forEach((component) => {
    const el = document.getElementById(component.containerId);
    if (el) {
      let skeleton = getSkeleton(component);
      el.innerHTML = skeleton;
    }
  });

  const cacheKey = `ssr:${btoa(JSON.stringify(components))}`;
  const cachedHtml = cacheProvider.get(cacheKey);
  let htmlList: { containerId: string; html: string }[];

  if (cachedHtml) {
    htmlList = JSON.parse(cachedHtml);
  } else {
    let url: string = ssrEndpoint;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (useJWT.active && useJWT.getToken) {
      const token = await useJWT.getToken(components);

      if (useJWT.asAuthHeader) headers['Authorization'] = `Bearer ${token}`;
      if (useJWT.keyParams) url = `${ssrEndpoint}?${useJWT.keyParams}=${token}`
    }

    const res = await fetch(ssrEndpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(components),
    });

    htmlList = await res.json();
    cacheProvider.set(cacheKey, JSON.stringify(htmlList));
  }

  htmlList.forEach(({ containerId, html }) => {
    const el = document.getElementById(containerId);
    if (el) {
      if (sanitize) {
        el.innerHTML = sanitizeHTML(html);
        console.warn("Hydration might not work on sanitized HTML.")
      } else {
        el.innerHTML = html;
      }
    }
  });

  const hydrateModule = await import(/* @vite-ignore */ hydrateScriptUrl);
  if (hydrateModule?.hydrate) {
    hydrateModule.hydrate(components);
  } else {
    console.warn('hydrate() not found in module');
  }
}
