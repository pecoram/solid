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

export interface RendererMainSettings {
  /**
   * Authored logical pixel width of the application
   *
   * @defaultValue `1920`
   */
  appWidth?: number;
  /**
   * Authored logical pixel height of the application
   *
   * @defaultValue `1080`
   */
  appHeight?: number;
  /**
   * Factor to convert app-authored logical coorindates to device logical coordinates
   *
   * @remarks
   * This value allows auto-scaling to support larger/small resolutions than the
   * app was authored for.
   *
   * If the app was authored for 1920x1080 and this value is 2, the app's canvas
   * will be rendered at 3840x2160 logical pixels.
   *
   * Likewise, if the app was authored for 1920x1080 and this value is 0.66667,
   * the app's canvas will be rendered at 1280x720 logical pixels.
   *
   * @defaultValue `1`
   */
  deviceLogicalPixelRatio?: number;
  /**
   * Factor to convert device logical coordinates to device physical coordinates
   *
   * @remarks
   * This value allows auto-scaling to support devices with different pixel densities.
   *
   * This controls the number of physical pixels that are used to render each logical
   * pixel. For example, if the device has a pixel density of 2, each logical pixel
   * will be rendered using 2x2 physical pixels.
   *
   * By default, it will be set to `window.devicePixelRatio` which is the pixel
   * density of the device the app is running on reported by the browser.
   *
   * @defaultValue `window.devicePixelRatio`
   */
  devicePhysicalPixelRatio?: number;
  /**
   * RGBA encoded number of the background to use
   *
   * @defaultValue `0x00000000`
   */
  clearColor?: number;
  /**
   * Path to a custom core module to use
   *
   * @defaultValue `null`
   */
  coreExtensionModule?: string | null;
  /**
   * Enable experimental FinalizationRegistry-based texture usage tracking
   * for texture garbage collection
   *
   * @remarks
   * By default, the Renderer uses a manual reference counting system to track
   * texture usage. Textures are eventually released from the Core Texture
   * Manager's Usage Cache when they are no longer referenced by any Nodes (or
   * SubTextures that are referenced by nodes). This works well enough, but has
   * the consequence of textures being removed from Usage Cache even if their
   * references are still alive in memory. This can require a texture to be
   * reloaded from the source when it is used again after being removed from
   * cache.
   *
   * This is an experimental feature that uses a FinalizationRegistry to track
   * texture usage. This causes textures to be removed from the Usage Cache only
   * when their references are no longer alive in memory. Meaning a loaded texture
   * will remain in the Usage Cache until it's reference is garbage collected.
   *
   * This feature is not enabled by default because browser support for the
   * FinalizationRegistry is limited. It should NOT be enabled in production apps
   * as this behavior is not guaranteed to be supported in the future. Developer
   * feedback on this feature, however, is welcome.
   *
   * @defaultValue `false`
   */
  experimental_FinalizationRegistryTextureUsageTracker?: boolean;
}

export interface SolidRendererOptions extends RendererMainSettings {
  threadXCoreWorkerUrl?: string;
  rootId: string | HTMLElement;
}

