let pulseStyleInjected = false;
export function defaultSkeleton(component) {
    if (!pulseStyleInjected && typeof document !== 'undefined') {
        const style = document.createElement('style');
        style.id = '__ssr_skeleton_pulse__';
        style.textContent = `
      @keyframes pulse {
        0% { background-color: #e0e0e0; }
        50% { background-color: #cccccc; }
        100% { background-color: #e0e0e0; }
      }

      .ssr-skeleton {
        animation: pulse 1.2s ease-in-out infinite;
      }
    `;
        document.head.appendChild(style);
        pulseStyleInjected = true;
    }
    return `<div class="ssr-skeleton" style="height:100px;border-radius:8px;"></div>`;
}
