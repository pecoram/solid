import { type JSX } from "solid-js";
import { type SolidRendererOptions } from '../core/renderer/index.js';
import { ElementNode } from "../core/node/index.js";
export interface CanvasOptions {
    coreExtensionModule?: string;
    threadXCoreWorkerUrl?: string;
}
export interface CanvasProps {
    options?: Partial<SolidRendererOptions>;
    onFirstRender?: (callback: () => void) => void;
    children?: JSX.Element;
    ref?: (el: ElementNode) => void;
}
export declare const Canvas: (props: CanvasProps) => JSX.Element;
