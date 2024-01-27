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

import { createEffect, type JSX } from "solid-js";
import { ElementNode, type SolidNode } from "../core/node/index.js";
import { isFunc } from "../core/utils.js";
import type { SolidRendererOptions } from "../core/renderer/index.js";

export interface CanvasOptions {
  coreExtensionModule?: string,
  threadXCoreWorkerUrl?: string,
}

export interface CanvasProps {
  options?: Partial<SolidRendererOptions>;
  onFirstRender?: (callback: () => void) => void;
  children?: JSX.Element;
  ref?: (el: ElementNode) => void;
}

export const Canvas = (props: CanvasProps) => {
  let root: HTMLDivElement | undefined;

  createEffect(() => {
    isFunc(props.onFirstRender) && props.onFirstRender(root);
  })
  return (
    <div ref={root} style={{inset:0, padding:0, width:'100vw', height:'100vh', background:'#000'}}>
      {props.children}
    </div>
  )
};
