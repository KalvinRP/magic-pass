export async function ensureAutoHydrateLoaded(hydrationEndpoint: string) {
  if ((window as any).AutoHydrate) return;

  const scriptUrl = `${hydrationEndpoint.replace(/\/$/, '')}/auto-hydrate`;

  // Cek apakah script sudah ada
  const existingScript = document.querySelector(`script[src="${scriptUrl}"]`);
  if (existingScript) {
    // Kalau sudah ada, tunggu sampai AutoHydrate tersedia
    await waitForAutoHydrate();
    return;
  }

  await new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = scriptUrl;
    script.async = true;
    script.onload = async () => {
      try {
        await waitForAutoHydrate();
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
