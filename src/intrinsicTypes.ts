/*
 * Copyright 2023 Comcast Cable Communications Management, LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { type JSX } from 'solid-js';
import { type ElementNode } from './core/node/index.js';
import type { NodeStates } from './core/node/states.js';
import type { AnimationSettings } from './config.js';

type AddUndefined<T> = {
  [K in keyof T]: T[K] | undefined;
};

// Type that transforms all number typed properties to a tuple
type TransformAnimatableNumberProps<T> = {
  [K in keyof T]?: number extends T[K] ? number | AnimatableNumberProp : T[K];
};

export type AnimatableNumberProp = [
  value: number,
  settings: Partial<AnimationSettings>,
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
  effects?: any; // Should be EffectMap
  flexDirection?: 'row' | 'column';
  gap?: number;
  justifyContent?:
    | 'flexStart'
    | 'flexEnd'
    | 'center'
    | 'spaceBetween'
    | 'spaceEvenly';
  linearGradient?: any; // Should be typeof LinearGradientEffect
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

export type INodeAnimatableProps = HTMLStyleElement;
export type INodeWritableProps = HTMLStyleElement;

export type IntrinsicCommonProps = IntrinsicNodeCommonProps &
  IntrinsicNodeStyleCommonProps &
  IntrinsicTextStyleCommonProps;

export type TransformableNodeWritableProps = TransformAnimatableNumberProps<
  Omit<INodeAnimatableProps, 'zIndex' | 'zIndexLocked'>
>;

export interface IntrinsicNodeStyleProps {
  [key: string]: unknown;
}

export interface IntrinsicTextNodeStyleProps
  extends IntrinsicTextStyleCommonProps {
  [key: string]: unknown;
}

export interface IntrinsicNodeProps
  extends AddUndefined<IntrinsicNodeCommonProps & IntrinsicNodeStyleProps> {
  style?: IntrinsicNodeStyleProps | undefined;
  domStyle?: JSX.CSSProperties | undefined;
  children?: JSX.Element | undefined;
  width?: number;
  height?: number;
  color?: string | number | undefined;
  src?: string | undefined;
  position?: string | undefined;
  hide?: boolean;
}

export interface IntrinsicTextProps
  extends AddUndefined<IntrinsicNodeCommonProps & IntrinsicTextNodeStyleProps> {
  style?: IntrinsicTextNodeStyleProps | undefined;
  children: string | string[];
}

export type NodeStyles = IntrinsicNodeStyleProps;
export type TextStyles = IntrinsicTextNodeStyleProps;
export type NodeProps = IntrinsicNodeProps;
export type TextProps = IntrinsicTextProps;
