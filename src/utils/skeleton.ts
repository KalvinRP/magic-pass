import type { ComponentDef } from '../types';

let pulseStyleInjected = false;

export function defaultSkeleton(component: ComponentDef, timeoutMs: number): string {
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
        width: 100%;
        height: 100%;
        border-radius: 8px;
      }

      .ssr-skeleton-wrapper {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: stretch;
      }
    `;
    document.head.appendChild(style);
    pulseStyleInjected = true;
  }

  const skeletonHTML = `
    <div class="ssr-skeleton-wrapper">
      <div class="ssr-skeleton"></div>
    </div>
  `;

  const container = document.getElementById(component.containerId);
  if (container) {
    // Ensure the container has a fallback height so skeleton appears
    if (!container.style.minHeight) {
      container.style.minHeight = '100px';
    }
    container.innerHTML = skeletonHTML;
  }

  return skeletonHTML;
}

export function renderErrorFallback(retryId: string, message = '⚠️ Gagal memuat komponen.') {
  return `
    <div style="padding:1rem; border:1px solid #ccc; border-radius:8px; background:#fff3f3; text-align:center; color:#b00020;">
      <div style="margin-bottom:0.5rem;">${message}</div>
      <button data-retry-id="${retryId}" class="ssr-retry-button" style="padding:0.5rem 1rem; background:#d32f2f; color:white; border:none; border-radius:4px; cursor:pointer;">
        Coba Lagi
      </button>
    </div>
  `;
}
