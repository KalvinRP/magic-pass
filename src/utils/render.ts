import type { ComponentDef, RenderedComponent, SkeletonRenderer } from '../types';
import { renderErrorFallback } from './skeleton';

export function renderComponentSkeleton(
  component: ComponentDef,
  skeletonRenderer: SkeletonRenderer,
  timeoutMs: number
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

export function hydrateComponent(
  { name, html, containerId, error }: RenderedComponent,
  components: ComponentDef[]
): boolean {
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