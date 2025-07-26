export async function ensureAutoHydrateLoaded(hydrationEndpoint: string) {
  if ((window as any).AutoHydrate) return;

  await new Promise<void>((resolve) => {
    const script = document.createElement('script');
    script.src = `${hydrationEndpoint.replace(/\/$/, '')}/auto-hydrate`;
    script.async = true;
    script.onload = () => resolve();
    document.body.appendChild(script);
  });
}