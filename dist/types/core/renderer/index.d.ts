import { RendererMain, type RendererMainSettings } from '@lightningjs/renderer';
export declare let renderer: RendererMain;
export declare let createShader: RendererMain['createShader'];
export interface SolidRendererOptions extends RendererMainSettings {
    threadXCoreWorkerUrl?: string;
    rootId: string | HTMLElement;
}
export declare function startLightningRenderer(options?: Partial<SolidRendererOptions>): RendererMain;
