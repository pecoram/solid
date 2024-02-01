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

import {
  type AnimatableNumberProp,
  type BorderStyleObject,
  type INodeAnimatableProps,
  type IntrinsicCommonProps,
  type IntrinsicNodeStyleProps,
  type NodeStyles,
  type TextStyles,
} from '../../index.js';
import States, { type NodeStates } from './states.js';
import calculateFlex from '../flex.js';
import {
  log,
  isArray,
  isNumber,
  isFunc,
  keyExists,
  getAnimatableValue,
} from '../utils.js';
import { config, type AnimationSettings } from '../../config.js';
import { setActiveElement } from '../activeElement.js';
import Children from './children.js';

const { animationSettings: defaultAnimationSettings } = config;

function borderAccessor(
  direction: '' | 'Top' | 'Right' | 'Bottom' | 'Left' = '',
) {
  return {
    set(this: ElementNode, value: number | { width: number; color: number }) {
      // Format: width || { width, color }
      if (isNumber(value)) {
        value = { width: value, color: 0x000000ff };
      }
      this.effects = {
        ...(this.effects || {}),
        ...{ [`border${direction}`]: value },
      };
      this[`_border${direction}`] = value;
    },
    get(this: ElementNode) {
      return this[`_border${direction}`];
    },
  };
}

const StyleNumberProps = [
  'alpha',
  'opacity',
  'color',
  'colorTop',
  'colorRight',
  'colorLeft',
  'colorBottom',
  'colorTl',
  'colorTr',
  'colorBl',
  'colorBr',
  'lineHeight',
  'mount',
  'mountX',
  'mountY',
  'pivot',
  'pivotX',
  'pivotY',
  'rotation',
  'scale',
  'worldX',
  'worldY',
  'zIndex',
  'zIndexLocked',
];

const StylePixelProps = [
  'x',
  'y',
  'top',
  'left',
  'width',
  'height'
];

const StyleNonAnimatingProps = [
  'clipping',
  'contain',
  'fontFamily',
  'src',
  'text',
  'textAlign',
  'texture',
  'maxLines',
  'maxLinesSuffix',
  'textOverflow',
  'verticalAlign',
  'textBaseline',
  'wordWrap',
];

const SupportPropertyStyle = ['x', 'y', 'width', 'height', 'position', 'alpha'];

export interface TextNode {
  name: string;
  text: string;
  parent: ElementNode | null;
  zIndex?: number;
  states?: States;
  x?: number;
  y?: number;
  alpha?: number;
  width?: number;
  height?: number;
  marginLeft?: number;
  marginRight?: number;
  marginTop?: number;
  marginBottom?: number;
  /**
   * Managed by dom-inspector
   */
  _dom?: Text; // Public but uses _ prefix
}

export type SolidNode = ElementNode | TextNode;
export type SolidStyles = NodeStyles | TextStyles;

export interface Dimensions {
  width: number;
  height: number;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface ElementNode
  extends Partial<Omit<INodeWritableProps, 'parent' | 'shader'>>,
    IntrinsicCommonProps {
  [key: string]: unknown;
}

export const MapProps: Record<string, string> = {
  x: 'left',
  y: 'top',
  alpha: 'opacity',
  color: 'background-color',
};


// const animationTransition{
//   transition": "width 2s, height 4s";
// }

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class ElementNode extends Object {
  name: string;
  element: HTMLElement | undefined;
  selected?: number;
  rendered: boolean;
  autofocus: boolean;

  parentNode: ElementNode | null;
  nextSibling: ElementNode | undefined;
  prevSibling: ElementNode | undefined;
  childNodes: ElementNode[];
  firstChild: ElementNode | undefined;

  private _undoStates?: Record<string, any>;
  private _renderProps: any;
  private _effects: any;
  private _parent: ElementNode | undefined;
  private _style?: SolidStyles;
  private _states?: States;
  private _animationSettings?: Partial<AnimationSettings>;
  private _width?: number;
  private _height?: number;
  private _color?: number;
  private _borderRadius?: number;
  private _border?: BorderStyleObject;
  private _borderLeft?: BorderStyleObject;
  private _borderRight?: BorderStyleObject;
  private _borderTop?: BorderStyleObject;
  private _borderBottom?: BorderStyleObject;
  public _animate?: boolean; // Public but uses _ prefix
  public _autosized?: boolean; // Public but uses _ prefix
  public _isDirty?: boolean; // Public but uses _ prefix
  public _src: string | undefined;
  public _dom?: HTMLDivElement; // Public but uses _ prefix
  public _domImage?: HTMLImageElement;
  public children: Children ;

  /**
   * Private fields
   */
  private _img?: HTMLImageElement;

  constructor(name: string) {
    super();
    this.name = name;
    this.rendered = false;
    this.autofocus = false;
    this._renderProps = { x: 0, y: 0 };
    this.children = new Children(this);
    this.childNodes = [];
    this.parentNode = null;
    this.firstChild = undefined;
    this.nextSibling = undefined;
    this.prevSibling = undefined;
    this.element = document.createElement('div');
    // this.element.style.position = 'absolute';
    // this.element.style.width = '100%';
    // this.element.style.height = '100%';
    this._bindProps();
  }

  _bindProps = () => {

    for (const key of StylePixelProps) {
      Object.defineProperty(this, key, {
        get(): number {
          switch(key){
            case 'x':
            case 'left':{
              return this[`_${key}`] ?? this.element?.offsetLeft;
            }
            case 'y':
            case 'top':{
              return this[`_${key}`] ?? this.element?.offsetTop;
            }
            default:{
              return this[`_${key}`];
            }
          }

        },
        set(v: number | AnimatableNumberProp) {
          const value = getAnimatableValue(v);
          this[`_${key}`] = v;
          this.setStyle(key, value);
        },
      });
    }

    for (const key of StyleNumberProps) {
      Object.defineProperty(this, key, {
        get(): number {
          return this[`_${key}`] || (this.lng && this.lng[key]);
        },
        set(v: number | AnimatableNumberProp) {
          const value = getAnimatableValue(v);
          this[`_${key}`] = getAnimatableValue(v);
          this.setStyles(key, value);
        },
      });
    }

    for (const key of StyleNonAnimatingProps) {
      Object.defineProperty(this, key, {
        get() {
          return this[`_${key}`] || (this.lng && this.lng[key]);
        },
        set(v) {
          this[`_${key}`] = v;
          this.setStyles(key, v);
        },
      });
    }
    // Add Border Helpers
    Object.defineProperties(this, {
      borderRadius: {
        set(this: ElementNode, radius) {
          this._borderRadius = radius;
          this.effects = {
            ...(this.effects || {}),
            ...{ radius: { radius } },
          };
        },
        get(this: ElementNode) {
          return this._borderRadius;
        },
      },
      border: borderAccessor(),
      borderLeft: borderAccessor('Left'),
      borderRight: borderAccessor('Right'),
      borderTop: borderAccessor('Top'),
      borderBottom: borderAccessor('Bottom'),
    });

    Object.defineProperties(this, {
      linearGradient: {
        set(props = {}) {
          this._linearGradient = props;
          this.effects = {
            ...(this.effects || {}),
            ...{ linearGradient: props },
          };
        },
        get() {
          return this._linearGradient;
        },
      },
    });
  };

  _createImageElement() {
    if(!this.element){
      return;
    }
    this._domImage = document.createElement('img');
    this._domImage.style.resize = 'contain';
    this._domImage.style.width = '100%';
    this._domImage.style.height = '100%';
    this._domImage.crossOrigin = 'anonymous';
    this._domImage.loading = "lazy";
    this.element.append(this._domImage);
  }

  _attachImage(src: string | undefined) {
    if (!this.element) {
      return;
    }
    if (!this._domImage) {
      this._createImageElement();
    }
    if(this._domImage){
      const img = this._domImage;
      this._domImage.onload = () => {
        if(typeof this['onLoad'] === 'function'){
          const w = img?.width ?? 0;
          const h = img?.height ?? 0;
          this.onLoad(this, {type: 'texture',  dimensions:{width: w, height: h}});
        }
      };
      this._domImage.onerror = (error) => {
        console.log("@@@@@ this._domImage.onerror");
        console.log(error);
        if(typeof this['onFail'] === 'function'){
          this.onFail(this, {type: 'texture',  error: error ?? new Error("error load image")});
        }
      }
      this._domImage.src = src ?? "";
    }
    this._src = src;
  }


  get effects() {
    return this._effects;
  }

  set effects(v) {
    this._effects = v;
  }

  get parent() {
    return this._parent;
  }

  set parent(p) {
    this._parent = p;
  }


  createAnimation(
    props: Partial<INodeAnimatableProps>,
    animationSettings?: Partial<AnimationSettings>,
  ) {
    // this.setStyle('transition-property',"opacity, left, top");
    // this.setStyle('transition-duration',"0.2s, 0.1s, 0.1s");
    //this.setStyle('transition-timing-function', "ease-in-out");
  }

  createAnimations() {
    // this.setStyle('transition-property',"opacity, left, top");
    // this.setStyle('transition-duration',"0.2s, 0.1s, 0.1s");
    //this.setStyle('transition-timing-function', "ease-in-out");
  }
  removeChild(node: ElementNode) {
    try{
      this.children.remove(node);
    }catch(ex){
      console.log(ex)
    }finally{
      this.rendered = true;
    }
  }

  insertNode(node: ElementNode, anchor: ElementNode | null) {
    try{
      this.children.insert(node, anchor);
    }catch(ex){
      console.log(ex)
    }finally{
      this.rendered = true;
    }
  }

  getParentNode() {
    return this._parent;
  }
  getFirstChild(): ElementNode | undefined {
    return this.children[0];
  }

  isTextNode() {
    return this.name === 'text';
  }

  destroy() {}

  convertPixelValue(value: string | number | undefined) {
    if (typeof value === 'string') {
      return value;
    }
    if (isNumber(value)) {
      return `${value}px`;
    }
    return value;
  }

  setProperty(name: string, value: string | number | boolean | undefined) {
    const domElement = this.element;
    if (!domElement) {
      return;
    }
    const property = name.toLowerCase().trim();
    if (!property) {
      return;
    }
    switch (property) {
      case 'src': {
        if (typeof value === 'string') {
          this._attachImage(value);
        } else {
          this._attachImage(undefined);
        }
        break;
      }
      case 'animate': {
        this.createAnimations();
        break;
      }
      case 'selected': {
        if (isNumber(value)) {
          this.selected = value;
        }
        break;
      }
      case 'autofocus': {
        if(typeof value == "boolean"){
          this.autofocus = value || false;
          if(this.autofocus){
            this.setFocus();
          }
        }
        break;
      }
      case 'clipping': {
        this.setStyle('overflow', 'hidden');
        break;
      }
      default: {
        if (SupportPropertyStyle.includes(name)) {
          //@ts-ignore
          this.setStyle(name, value);
        }
        break;
      }
    }
  }

  remapKeyStyle(key: string): string {
    return MapProps[key] ?? key;
  }

  setStyle(name: string, value: string | number | undefined) {
    if (!this.element) {
      return;
    }
    let val = value;
    const key = this.remapKeyStyle(name) ?? name;
    if (StylePixelProps.includes(key)) {
      val = this.convertPixelValue(val);
    }
    switch (key) {
      // case 'opacity': {
      //   if(isNumber(val) && val <= 0){
      //     this.element.style.display = 'none';
      //   }
      //   break;
      // }
      default: {
        try {
          //@ts-ignore
          this.element.style[key] = val;
        } catch (ex) {
            console.log(ex);
        }
        break;
      }
    }
  }

  setFocus() {
    if (this.element && this.rendered) {
      queueMicrotask(() => setActiveElement<ElementNode>(this));
    } else {
      this.autofocus = true;
    }
  }

  setStyles(name: string, value: object | string | number | undefined) {
    if (!this.element) {
      return;
    }
    if (value && value instanceof Object) {
      for (const [k, v] of Object.entries(value)) {
        this.setStyle(k, v);
      }
    } else {
      this.setStyle(name, value);
    }
  }

  get style(): SolidStyles {
    return this._style!;
  }

  get hasChildren() {
    return this.children.length > 0;
  }

  set states(states: NodeStates) {
    this._states = new States(this._stateChanged.bind(this), states);
    if (this.rendered) {
      this._stateChanged();
    }
  }

  get states(): States {
    this._states = this._states || new States(this._stateChanged.bind(this));
    return this._states;
  }

  get animationSettings(): Partial<AnimationSettings> {
    return this._animationSettings || defaultAnimationSettings;
  }

  set animationSettings(animationSettings: Partial<AnimationSettings>) {
    this._animationSettings = animationSettings;
  }

  updateLayout(child?: ElementNode, dimensions?: Dimensions) {
    if (this.hasChildren) {
      log('Layout: ', this);
      isFunc(this.onBeforeLayout) &&
        this.onBeforeLayout.call(this, child, dimensions);

      if (this.display === 'flex') {
        if (calculateFlex(this)) {
          this.parent?.updateLayout();
        }
      }

      isFunc(this.onLayout) && this.onLayout.call(this, child, dimensions);
    }
  }

  _stateChanged() {
    log('State Changed: ', this, this.states);

    if (this.forwardStates) {
      // apply states to children first
      const states = this.states.slice() as States;
      this.children.forEach((c) => (c.states = states));
    }

    const states = config.stateMapperHook?.(this, this.states) || this.states;

    if (this._undoStates || (this.style && keyExists(this.style, states))) {
      this._undoStates = this._undoStates || {};
      let stylesToUndo = {};

      for (const [state, undoStyles] of Object.entries(this._undoStates)) {
        // if state is no longer in the states undo it
        if (!states.includes(state)) {
          stylesToUndo = {
            ...stylesToUndo,
            ...undoStyles,
          };
        }
      }

      const newStyles = states.reduce((acc, state) => {
        const styles = this.style[state];
        if (styles) {
          acc = {
            ...acc,
            ...styles,
          };

          // get current values to undo state
          if (this._undoStates && !this._undoStates[state]) {
            this._undoStates[state] = {};
            Object.keys(styles).forEach((key) => {
              this._undoStates![state][key] = this[key as keyof this];
            });
          }
        }
        return acc;
      }, {});

      // Apply the styles
      Object.assign(this, { ...stylesToUndo, ...newStyles });
    }
  }

}
