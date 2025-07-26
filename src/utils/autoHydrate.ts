export async function ensureAutoHydrateLoaded(
  hydrationEndpoint: string,
  withReactHydration: boolean
) {
  if ((window as any).AutoHydrate) {
    // Update config jika AutoHydrate sudah ada
    (window as any).AutoHydrate.config = {
      ...(window as any).AutoHydrate.config || {},
      withReactHydration,
    };
    return;
  }

  const scriptUrl = `${hydrationEndpoint.replace(/\/$/, '')}`;

  const existingScript = document.querySelector(`script[src="${scriptUrl}"]`);
  if (existingScript) {
    await waitForAutoHydrate();
    // Set config setelah script dimuat
    if ((window as any).AutoHydrate) {
      (window as any).AutoHydrate.config = {
        ...(window as any).AutoHydrate.config || {},
        withReactHydration,
      };
    }
    return;
  }

  await new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = scriptUrl;
    script.async = true;
    script.onload = async () => {
      try {
        await waitForAutoHydrate();

        if ((window as any).AutoHydrate) {
          (window as any).AutoHydrate.config = {
            ...(window as any).AutoHydrate.config || {},
            withReactHydration,
          };
        }

        resolve();
      } catch (err) {
        reject(err);
      }
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}


function waitForAutoHydrate(timeoutMs = 3000, intervalMs = 50): Promise<void> {
  return new Promise((resolve, reject) => {
    const start = Date.now();

    const check = () => {
      if ((window as any).AutoHydrate) {
        resolve();
      } else if (Date.now() - start > timeoutMs) {
        reject(new Error('AutoHydrate failed to load within timeout'));
      } else {
        setTimeout(check, intervalMs);
      }
    };

    check();
  });
}
