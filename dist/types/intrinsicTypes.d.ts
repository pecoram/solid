import { type AnimationSettings, type Dimensions, type INode, type INodeAnimatableProps, type INodeWritableProps, type ITextNodeWritableProps, type NodeFailedPayload, type NodeLoadedPayload } from '@lightningjs/renderer';
import { type JSX } from 'solid-js';
import { type ElementNode } from './core/node/index.js';
import type { NodeStates } from './core/node/states.js';
type AddUndefined<T> = {
    [K in keyof T]: T[K] | undefined;
};
type TransformAnimatableNumberProps<T> = {
    [K in keyof T]?: number extends T[K] ? number | AnimatableNumberProp : T[K];
};
export type AnimatableNumberProp = [
    value: number,
    settings: Partial<AnimationSettings>
];
export interface BorderStyleObject {
    width: number;
    color: number;
}
export type BorderStyle = number | BorderStyleObject;
export interface IntrinsicNodeCommonProps {
    animate?: boolean;
    animationSettings?: Partial<AnimationSettings>;
    autofocus?: boolean;
    forwardStates?: boolean;
    id?: string;
    onCreate?: (target: ElementNode) => void;
    onLoad?: (target: INode, nodeLoadedPayload: NodeLoadedPayload) => void;
    onFail?: (target: INode, nodeFailedPayload: NodeFailedPayload) => void;
    onBeforeLayout?: (child: ElementNode, dimensions: Dimensions) => void;
    onLayout?: (child: ElementNode, dimensions: Dimensions) => void;
    ref?: ElementNode | ((node: ElementNode | null) => void) | null;
    selected?: number;
    states?: NodeStates;
    text?: string;
}
export interface IntrinsicNodeStyleCommonProps {
    alignItems?: 'flexStart' | 'flexEnd' | 'center';
    border?: BorderStyle;
    borderBottom?: BorderStyle;
    borderLeft?: BorderStyle;
    borderRadius?: number;
    borderRight?: BorderStyle;
    borderTop?: BorderStyle;
    display?: 'flex';
    effects?: any;
    flexDirection?: 'row' | 'column';
    gap?: number;
    justifyContent?: 'flexStart' | 'flexEnd' | 'center' | 'spaceBetween' | 'spaceEvenly';
    linearGradient?: any;
    marginBottom?: number;
    marginLeft?: number;
    marginRight?: number;
    marginTop?: number;
}
export interface IntrinsicTextStyleCommonProps {
    marginLeft?: number;
    marginRight?: number;
    marginTop?: number;
    marginBottom?: number;
}
export type IntrinsicCommonProps = IntrinsicNodeCommonProps & IntrinsicNodeStyleCommonProps & IntrinsicTextStyleCommonProps;
export type TransformableNodeWritableProps = TransformAnimatableNumberProps<Omit<INodeAnimatableProps, 'zIndex' | 'zIndexLocked'>>;
export interface IntrinsicNodeStyleProps extends Partial<Omit<INodeWritableProps, 'parent' | 'shader' | keyof TransformableNodeWritableProps>>, TransformableNodeWritableProps, IntrinsicNodeStyleCommonProps {
    [key: string]: unknown;
}
export interface IntrinsicTextNodeStyleProps extends Partial<Omit<ITextNodeWritableProps, 'parent' | 'shader'>>, IntrinsicTextStyleCommonProps {
    [key: string]: unknown;
}
export interface IntrinsicNodeProps extends AddUndefined<IntrinsicNodeCommonProps & IntrinsicNodeStyleProps> {
    style?: IntrinsicNodeStyleProps | undefined;
    children?: JSX.Element | undefined;
}
export interface IntrinsicTextProps extends AddUndefined<IntrinsicNodeCommonProps & IntrinsicTextNodeStyleProps> {
    style?: IntrinsicTextNodeStyleProps | undefined;
    children: string | string[];
}
export type NodeStyles = IntrinsicNodeStyleProps;
export type TextStyles = IntrinsicTextNodeStyleProps;
export type NodeProps = IntrinsicNodeProps;
export type TextProps = IntrinsicTextProps;
export {};
