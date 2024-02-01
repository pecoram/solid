/* eslint-disable @typescript-eslint/unbound-method */
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

import { createRenderer } from "solid-js/universal";
import { ElementNode } from "./node/index.js";

const PROPERTIES = new Set(["className", "textContent"]);

export const {
  render,
  effect,
  memo,
  createComponent,
  createElement,
  createTextNode,
  insertNode,
  insert,
  spread,
  setProp,
  mergeProps,
  use
} = createRenderer({
  createElement(type): ElementNode {
    //console.log(`createElement: [${type}]`);
    const node = new ElementNode(type);
    return node;
  },
  createTextNode(text) {
    //console.log(`createTextNode: [${text}]`);
    return document.createTextNode(text);
  },
  replaceText(node, text) {
    //console.log(`replaceText: [${text}]`);
    //node.data = text;
  },
  insertNode(parent, node, anchor) {
    const domParent = (parent.element) ?? parent;
    const domNode = node.element;
    const domAnchor = (anchor && anchor.element) ? anchor.element : anchor;
    if(domNode && domParent && typeof domParent.insertBefore === 'function'){
      try{
        //console.log("domParent.insertBefore ");
        //console.log(domNode);
        domParent.insertBefore(domNode, domAnchor);
        if(parent instanceof ElementNode && node instanceof ElementNode){
          parent.insertNode(node, anchor ?? null);
        }
        //console.log("yeahhhh")
      }catch(ex){
        //console.log(ex);
      }
    }

  },
  removeNode(parent, node) {
    const domParent = (parent.element) ?? parent;
    const domNode = node.element;
    if(domNode && domParent){
      try{
        //@ts-ignore
        //domParent.remove(domNode);
        if(parent instanceof ElementNode && node instanceof ElementNode){
          parent.removeChild(node);
        }
        //console.log("yeahhhh")
      }catch(ex){
        console.log(ex);
      }
    }
  },
  setProperty(node, name, value) {
    if (name === 'domStyle'){
      //console.log(typeof value)
      //@ts-ignore
      node.setStyles(name, value);
    }else if (name.startsWith('on')){
       node[name] = value;
    }else{
      //@ts-ignore
      if(name !== 'style'){
        node.setProperty(name, value);
        node[name] = value;
      }
    }
  },
  isTextNode(node) {
    //console.log(node);
    return node.type === 3;
  },
  getParentNode(node): ElementNode | undefined {
    return node.parent;
  },
  getFirstChild(node): ElementNode | undefined {
    return node.firstChild;
  },
  getNextSibling(node) {
    return node.nextSibling;
  },
});

export {
  For,
  Show,
  Suspense,
  SuspenseList,
  Switch,
  Match,
  Index,
  ErrorBoundary,
  useContext
} from "solid-js";

