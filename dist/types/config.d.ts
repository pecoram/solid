import type { AnimationSettings } from '@lightningjs/renderer';
import type { IntrinsicTextNodeStyleProps } from './intrinsicTypes.js';
import { type ElementNode } from './core/node/index.js';
interface Config {
    debug: boolean;
    animationSettings: Partial<AnimationSettings>;
    animationsEnabled: boolean;
    fontSettings: Partial<IntrinsicTextNodeStyleProps>;
    stateMapperHook?: (node: ElementNode, states: Array<string>) => Array<string>;
}
export declare const isDev: boolean;
export declare const config: Config;
export {};
