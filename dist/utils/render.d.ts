import type { ComponentDef, RenderedComponent, SkeletonRenderer, HydrationOption } from '../types';
export declare function renderComponentSkeleton(component: ComponentDef, skeletonRenderer: SkeletonRenderer, timeoutMs?: number): void;
export declare function filterUnhydratedComponents(components: ComponentDef[]): ComponentDef[];
export declare function hydrateComponent({ name, html, containerId, error, script }: RenderedComponent, components: ComponentDef[], hydrationOption: HydrationOption): Promise<boolean>;
export declare function loadComponentScript(script: string, scriptPrefix: string): Promise<void>;
