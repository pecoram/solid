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
    console.log(`createElement: [${type}]`);
    const node = new ElementNode(type);
    return node;
  },
  createTextNode(text) {
    console.log(`createTextNode: [${text}]`);
    return document.createTextNode(text);
  },
  replaceText(node, text) {
    console.log(`replaceText: [${text}]`);
    node.data = text;
  },
  insertNode(parent, node, anchor) {
    console.log("@@@ insertNode")
    console.log(parent);
    console.log(node);
    console.log(anchor);
    const domParent = (parent.element) ?? parent;
    const domNode = node.element;
    const domAnchor = (anchor && anchor.element) ? anchor.element : anchor;
    console.log("--- domParent");
    console.log(domParent);
    console.log("--- domNode");
    console.log(domNode);
    console.log("--- domAnchor");
    console.log(domAnchor);
    if(domNode && domParent && typeof domParent.insertBefore === 'function'){
      try{
        console.log("domParent.insertBefore ");
        console.log(domNode);
        domParent.insertBefore(domNode, domAnchor);
        console.log("yeahhhh")
      }catch(ex){
        debugger;
        console.log(ex);
      }
    }

  },
  removeNode(parent, node) {
    parent.removeChild(node);
  },
  setProperty(node, name, value) {
    console.log(`@@@ setProperty`);
    console.log(node);
    console.log(name);
    console.log(value);
    if (name === 'style'){
      console.log(typeof value)
      //@ts-ignore
      node.setStyles(name, value);
    }else if (name.startsWith('on')){
       node[name.toLowerCase()] = value;
    }else{
      //@ts-ignore
      node.setProperty(name, value);
    }
  },
  isTextNode(node) {
    console.log(node);
    return node.type === 3;
  },
  getParentNode(node): ElementNode | undefined {
    return node.parent;
  },
  getFirstChild(node): ElementNode | undefined {
    return node.children[0];
  },
  getNextSibling(node) {
    if(node.parent){
      const children = node.parent.children;
      const index = children.indexOf(node) + 1;
      if(index > -1 && index < children.length){
        return children[index];
      }
    }
    return undefined;
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

