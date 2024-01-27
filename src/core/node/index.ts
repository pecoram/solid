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
  type IntrinsicCommonProps,
  type IntrinsicNodeStyleProps,
  type NodeStyles,
  type TextStyles,
} from '../../index.js';
import Children from './children.js';
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

const SupportPropertyStyle = [
  "width",
  "height"
];

export interface TextNode {
  name: string;
  text: string;
  parent: ElementNode | null;
  zIndex?: number;
  states?: States;
  x?: number;
  y?: number;
  alpha? : number;
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
  width:number;
  height:number;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface ElementNode
  extends Partial<Omit<INodeWritableProps, 'parent' | 'shader'>>,
    IntrinsicCommonProps {
  [key: string]: unknown;
}

export const MapProps: Record<string,string> = {
  "x": "left",
  "y": "top",
  "alpha": "opacity",
  "color": "background-color"
}




// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class ElementNode extends Object {
  name: string;
  element: HTMLElement | undefined;
  selected?: number;
  rendered: boolean;
  autofocus: boolean;

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
  public children: Array<ElementNode> = [];

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
    this.children = [];
    this.element = document.createElement('div') ;
    // this.element.style.position = 'absolute';
    // this.element.style.width = '100%';
    // this.element.style.height = '100%';

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
  }

  _createImageElement(element: HTMLElement): HTMLImageElement {
      const img = document.createElement('img');
      img.src = "";
      img.style.resize = 'contain';
      img.style.maxWidth = '100%';
      img.style.maxHeight = '100%';
      img.crossOrigin = "anonymous";
      //downloadedImg.addEventListener("load", imageReceived, false);
      element.append(img);
      return img;
   }

  _attachImage (src: string | undefined){
    if(!this.element){
      return;
    }
    if(!this._img){
      this._img = this._createImageElement(this.element);
    }
    if(this._src !== src){
      this._img.src = src ?? '';
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

  createAnimation(){

  }

  removeChild(node:ElementNode){

  }

  getParentNode(){
    return this._parent;
  }
  getFirstChild(): ElementNode | undefined {
    return this.children[0]
  }


  isTextNode() {
    return this.name === 'text';
  }

  destroy() {

  }

  convertPixelValue(value: string | number | undefined){
    if(typeof value === 'string'){
      return value;
    }
    if(isNumber(value)){
      return `${value}px`;
    }
    return value;
  }


  setProperty(name: string, value: string | number | undefined){
    const domElement = this.element
    if(!domElement){
      return;
    }
    switch(name.toLowerCase()){
      case 'src':{
        if(typeof value === 'string'){
          this._attachImage(value);
        }else{
          this._attachImage(undefined);
        }
        break;
      }
      default:{
          //@ts-ignore
          console.log("==============");
          console.log("--  setProperty ---")
          console.log(`name: [${name}]`);
          console.log(value);
          console.log("==============");
          if(SupportPropertyStyle.includes(name)){
            //@ts-ignore
            this.setStyles(name, value);
          }else{
            this[name] = value;
          }

          break;
      }

    }
  }


  remapKeyStyle(key:string): string{
    return MapProps[key] ?? key;
  }

  setStyle(name: string, value: string | number | undefined){
    if(!this.element){
      return;
    }
    let val = value;
    const key = this.remapKeyStyle(name) ?? name;
    if(!StyleNumberProps.includes(key) && !StyleNumberProps.includes(name)){
      val = this.convertPixelValue(val);
    }
    console.log(`######## [${key}] ==> ${val} `);
    switch(key){
       case 'clipping':{
        this.element.style.overflow = "hidden";
        break;
       }
       default:{
        try{
          //@ts-ignore
          this.element.style[key] = val;
        }catch(ex){
          debugger;
          console.log(ex);
        }
        break;
       }
    }


  }

  setStyles(name: string, value: object | string | number | undefined){
    console.log("==============");
    console.log("--  setStyles ---")
    console.log(`name: [${name}]`);
    console.log(value);
    console.log("==============");
    if(!this.element){
      return;
    }
    if(value && value instanceof Object){
      for(const [k, v] of Object.entries(value)){
        this.setStyle(k,v);
      }
    }else{
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

  render() {

  }
}
