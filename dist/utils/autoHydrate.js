export async function ensureAutoHydrateLoaded(hydrationEndpoint, withReactHydration = false) {
    if (window.AutoHydrate) {
        // Update config jika AutoHydrate sudah ada
        window.AutoHydrate.config = {
            ...window.AutoHydrate.config || {},
            withReactHydration,
        };
        return;
    }
    const scriptUrl = `${hydrationEndpoint.replace(/\/$/, '')}`;
    const existingScript = document.querySelector(`script[src="${scriptUrl}"]`);
    if (existingScript) {
        await waitForAutoHydrate();
        // Set config setelah script dimuat
        if (window.AutoHydrate) {
            window.AutoHydrate.config = {
                ...window.AutoHydrate.config || {},
                withReactHydration,
            };
        }
        return;
    }
    await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = scriptUrl;
        script.async = true;
        script.onload = async () => {
            try {
                await waitForAutoHydrate();
                if (window.AutoHydrate) {
                    window.AutoHydrate.config = {
                        ...window.AutoHydrate.config || {},
                        withReactHydration,
                    };
                }
                resolve();
            }
            catch (err) {
                reject(err);
            }
        };
        script.onerror = reject;
        document.head.appendChild(script);
    });
}
function waitForAutoHydrate(timeoutMs = 3000, intervalMs = 50) {
    return new Promise((resolve, reject) => {
        const start = Date.now();
        const check = () => {
            if (window.AutoHydrate) {
                resolve();
            }
            else if (Date.now() - start > timeoutMs) {
                reject(new Error('AutoHydrate failed to load within timeout'));
            }
            else {
                setTimeout(check, intervalMs);
            }
        };
        check();
    });
}
