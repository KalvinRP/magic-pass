export async function ensureAutoHydrateLoaded(hydrationEndpoint) {
    if (window.AutoHydrate)
        return;
    await new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = `${hydrationEndpoint.replace(/\/$/, '')}/auto-hydrate`;
        script.async = true;
        script.onload = () => resolve();
        document.body.appendChild(script);
    });
}
