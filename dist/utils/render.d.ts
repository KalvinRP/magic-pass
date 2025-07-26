import type { ComponentDef, RenderedComponent, SkeletonRenderer } from '../types';
export declare function renderComponentSkeleton(component: ComponentDef, skeletonRenderer: SkeletonRenderer, timeoutMs?: number): void;
export declare function filterUnhydratedComponents(components: ComponentDef[]): ComponentDef[];
export declare function hydrateComponent({ name, html, containerId, error, script }: RenderedComponent, components: ComponentDef[], scriptPrefix?: string): Promise<boolean>;
export declare function loadComponentScript(url: string, prefix?: string): Promise<void>;
