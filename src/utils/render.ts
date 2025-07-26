import type { ComponentDef, RenderedComponent, SkeletonRenderer } from '../types';
import { renderErrorFallback } from './skeleton';

export function renderComponentSkeleton(
  component: ComponentDef,
  skeletonRenderer: SkeletonRenderer,
  timeoutMs: number = 5000
) {
  const el = document.getElementById(component.containerId);
  if (!el) return;

  el.innerHTML = skeletonRenderer(component, timeoutMs);

  const retryId = `retry-${component.containerId}`;
  (window as any).__MYAPP__.SSR_RETRY[retryId] = component;
  (window as any).__MYAPP__.SSR_RETRY_MAP[component.containerId] = retryId;

  const fallbackTimer = setTimeout(() => {
    if (el.dataset.hydrated !== 'true') {
      el.innerHTML = renderErrorFallback(retryId);
    }
  }, timeoutMs);

  el.dataset.fallbackTimer = fallbackTimer.toString();
}

export function filterUnhydratedComponents(components: ComponentDef[]) {
  return components.filter(({ containerId }) => {
    const el = document.getElementById(containerId);
    return el && el.dataset.hydrated !== 'true';
  });
}

export async function hydrateComponent(
  { name, html, containerId, error, script }: RenderedComponent,
  components: ComponentDef[],
  scriptPrefix?: string
): Promise<boolean> {
  const el = document.getElementById(containerId);
  if (!el || el.dataset.hydrated === 'true') return false;

  const retryId = (window as any).__MYAPP__.SSR_RETRY_MAP?.[containerId];

  if (error) {
    handleRenderError(el, retryId, error);
    return false;
  }

  const original = components.find(c => c.containerId === containerId && c.componentName === name);
  const props = original?.props ?? {};

  el.innerHTML = html;
  el.dataset.hydrated = 'true';

    if (script && typeof (window as any).AutoHydrate === 'undefined') {
    if (!scriptPrefix) {
      throw new Error('[SSR] Missing scriptPrefix for non-bundled hydration');
    }
    await loadComponentScript(script, scriptPrefix);
  }

  try {
    (window as any).AutoHydrate?.hydrate(name, containerId, props);
  } catch (err: any) {
    handleRenderError(el, retryId, err.message);
    return false;
  }

  if (el.dataset.fallbackTimer) {
    clearTimeout(Number(el.dataset.fallbackTimer));
    delete el.dataset.fallbackTimer;
  }

  return true;
}

function handleRenderError(el: HTMLElement, retryId: string, error: string) {
  if (el.dataset.fallbackTimer) {
    clearTimeout(Number(el.dataset.fallbackTimer));
  }

  el.innerHTML = renderErrorFallback(retryId, error);
}

export async function loadComponentScript(
  script: string,
  scriptPrefix: string
): Promise<void> {
  if (!script || !scriptPrefix) {
    throw new Error('[SSR] loadComponentScript: Missing script or scriptPrefix');
  }

  const fullUrl = `${scriptPrefix.replace(/\/$/, '')}/${script.replace(/^\//, '')}`;

  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${fullUrl}"]`)) return resolve();

    const scriptEl = document.createElement('script');
    scriptEl.type = 'module';
    scriptEl.src = fullUrl;
    scriptEl.async = true;
    scriptEl.onload = () => resolve();
    scriptEl.onerror = () => reject(new Error(`Failed to load script: ${fullUrl}`));
    document.head.appendChild(scriptEl);
  });
}


