import { renderErrorFallback } from './skeleton';
export function renderComponentSkeleton(component, skeletonRenderer, timeoutMs = 5000) {
    const el = document.getElementById(component.containerId);
    if (!el)
        return;
    el.innerHTML = skeletonRenderer(component, timeoutMs);
    const retryId = `retry-${component.containerId}`;
    window.__MYAPP__.SSR_RETRY[retryId] = component;
    window.__MYAPP__.SSR_RETRY_MAP[component.containerId] = retryId;
    const fallbackTimer = setTimeout(() => {
        if (el.dataset.hydrated !== 'true') {
            el.innerHTML = renderErrorFallback(retryId);
        }
    }, timeoutMs);
    el.dataset.fallbackTimer = fallbackTimer.toString();
}
export function filterUnhydratedComponents(components) {
    return components.filter(({ containerId }) => {
        const el = document.getElementById(containerId);
        return el && el.dataset.hydrated !== 'true';
    });
}
export async function hydrateComponent({ name, html, containerId, error, script }, components, scriptPrefix) {
    const el = document.getElementById(containerId);
    if (!el || el.dataset.hydrated === 'true')
        return false;
    const retryId = window.__MYAPP__.SSR_RETRY_MAP?.[containerId];
    if (error) {
        handleRenderError(el, retryId, error);
        return false;
    }
    const original = components.find(c => c.containerId === containerId && c.componentName === name);
    const props = original?.props ?? {};
    el.innerHTML = html;
    el.dataset.hydrated = 'true';
    if (script && typeof window.AutoHydrate === 'undefined' && scriptPrefix) {
        await loadComponentScript(script, scriptPrefix);
    }
    try {
        window.AutoHydrate?.hydrate(name, containerId, props);
    }
    catch (err) {
        handleRenderError(el, retryId, err.message);
        return false;
    }
    if (el.dataset.fallbackTimer) {
        clearTimeout(Number(el.dataset.fallbackTimer));
        delete el.dataset.fallbackTimer;
    }
    return true;
}
function handleRenderError(el, retryId, error) {
    if (el.dataset.fallbackTimer) {
        clearTimeout(Number(el.dataset.fallbackTimer));
    }
    el.innerHTML = renderErrorFallback(retryId, error);
}
export async function loadComponentScript(url, prefix) {
    let fullUrl = url;
    // Tambahkan prefix jika URL belum absolute
    if (!/^https?:\/\//.test(url) && prefix) {
        fullUrl = `${prefix.replace(/\/$/, '')}/${url.replace(/^\//, '')}`;
    }
    return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${fullUrl}"]`))
            return resolve();
        const script = document.createElement('script');
        script.src = fullUrl;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script: ${fullUrl}`));
        document.head.appendChild(script);
    });
}
