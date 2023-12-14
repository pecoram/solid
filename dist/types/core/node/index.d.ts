import { createShader } from '../renderer/index.js';
import { type AnimatableNumberProp, type IntrinsicCommonProps, type NodeStyles, type TextStyles } from '../../index.js';
import Children from './children.js';
import States, { type NodeStates } from './states.js';
import type { INode, INodeAnimatableProps, INodeWritableProps, ShaderRef, Dimensions, AnimationSettings } from '@lightningjs/renderer';
export interface TextNode {
    name: string;
    text: string;
    parent: ElementNode | null;
    zIndex?: number;
    states?: States;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    marginLeft?: number;
    marginRight?: number;
    marginTop?: number;
    marginBottom?: number;
    /**
     * Managed by dom-inspector
     */
    _dom?: Text;
}
export type SolidNode = ElementNode | TextNode;
export type SolidStyles = NodeStyles | TextStyles;
export interface ElementNode extends Partial<Omit<INodeWritableProps, 'parent' | 'shader'>>, IntrinsicCommonProps {
    [key: string]: unknown;
}
export declare class ElementNode extends Object {
    name: string;
    lng: INode | null;
    selected?: number;
    rendered: boolean;
    autofocus: boolean;
    private _undoStates?;
    private _renderProps;
    private _effects;
    private _parent;
    private _shader?;
    private _style?;
    private _states?;
    private _animationSettings?;
    private _width?;
    private _height?;
    private _color?;
    private _borderRadius?;
    private _border?;
    private _borderLeft?;
    private _borderRight?;
    private _borderTop?;
    private _borderBottom?;
    _animate?: boolean;
    _autosized?: boolean;
    _isDirty?: boolean;
    /**
     * Managed by dom-inspector
     */
    _dom?: HTMLDivElement;
    children: Children;
    constructor(name: string);
    get effects(): any;
    set effects(v: any);
    get parent(): ElementNode;
    set parent(p: ElementNode);
    get shader(): ShaderRef | undefined;
    set shader(v: Parameters<typeof createShader> | ShaderRef | undefined);
    _sendToLightningAnimatable(name: string, value: AnimatableNumberProp | number | string): any;
    _sendToLightning(name: string, value: unknown): void;
    createAnimation(props: Partial<INodeAnimatableProps>, animationSettings?: Partial<AnimationSettings>): any;
    setFocus(): void;
    isTextNode(): boolean;
    _resizeOnTextLoad(): void;
    getText(): string;
    destroy(): void;
    set style(value: SolidStyles);
    get style(): SolidStyles;
    get hasChildren(): boolean;
    set states(states: NodeStates);
    get states(): States;
    get animationSettings(): Partial<AnimationSettings>;
    set animationSettings(animationSettings: Partial<AnimationSettings>);
    _applyZIndexToChildren(): void;
    updateLayout(child?: ElementNode, dimensions?: Dimensions): void;
    _stateChanged(): void;
    render(): void;
}
