import type { ComponentDef, RenderedComponent, SkeletonRenderer } from '../types';
export declare function renderComponentSkeleton(component: ComponentDef, skeletonRenderer: SkeletonRenderer, timeoutMs?: number): void;
export declare function filterUnhydratedComponents(components: ComponentDef[]): ComponentDef[];
export declare function hydrateComponent({ name, html, containerId, error }: RenderedComponent, components: ComponentDef[]): boolean;
