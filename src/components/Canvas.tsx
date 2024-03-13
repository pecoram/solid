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

import { type JSX } from "solid-js";
import { startLightningRenderer, type SolidRendererOptions } from '../core/renderer/index.js';
import { ElementNode, type SolidNode } from "../core/node/index.js";
import { isFunc } from "../core/utils.js";


export interface CanvasOptions {
  coreExtensionModule?: string,
  threadXCoreWorkerUrl?: string,
}

export interface CanvasProps {
  ref?: ElementNode | ((node: ElementNode) => void) | undefined;
  options?: Partial<SolidRendererOptions>;
  onFirstRender?: (callback: (root: ElementNode) => void) => void;
  children?: JSX.Element;
}

export const Canvas = (props: CanvasProps = {}) => {
  const renderer = startLightningRenderer(props.options);
  const init = renderer.init();

  function rootRef(root : ElementNode): void {
    root.renderer = renderer;
    if (isFunc(props.ref)) {
      props.ref(root);
    } else {
      props.ref = root;
    }

    init.then(() => {
      root.lng = renderer.root!;
      root.children.forEach(c => (c as ElementNode).render());
      isFunc(props.onFirstRender) && props.onFirstRender(root);
    }).catch(console.error);
  }

  return (
    <canvas ref={rootRef}>
      {props.children}
    </canvas>
  )
};
