import { defaultSkeleton } from './skeleton';
export function initializeGlobalRetryState() {
    var _a;
    (_a = window).__MYAPP__ ?? (_a.__MYAPP__ = {
        SSR_RETRY: {},
        SSR_RETRY_MAP: {},
        SSR_CLICK_LISTENER_ATTACHED: false
    });
}
export function attachRetryClickListener() {
    if (window.__MYAPP__.SSR_CLICK_LISTENER_ATTACHED)
        return;
    document.addEventListener('click', async (event) => {
        const target = event.target;
        if (!target?.classList.contains('ssr-retry-button'))
            return;
        const retryId = target.dataset.retryId;
        const component = window.__MYAPP__.SSR_RETRY?.[retryId];
        if (!retryId || !component)
            return;
        const el = document.getElementById(component.containerId);
        if (!el)
            return;
        el.dataset.hydrated = 'false';
        el.innerHTML = defaultSkeleton(component, 5000);
        await window.MagicPass?.({ components: [component] });
    });
    window.__MYAPP__.SSR_CLICK_LISTENER_ATTACHED = true;
}
