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

import { isInteger, isNumber } from './core/utils.js';


export function isHexColor (hex: string) {
  return typeof hex === 'string'
      && hex.length === 6
      && !isNaN(Number('0x' + hex))
}

export function argbToRgba(color: number): string | undefined{
  if(!color || color.toString().length < 9){
    return undefined;
  }
  const colorArray = []
  for(let i=0; i<4; i++){
    colorArray.push(color % 256)
    color>>>=8
  }
  if(colorArray && colorArray.length > 3){
    const alpha = colorArray.pop() / 255
    return `rgba(${colorArray.reverse()},${alpha})`
  }
  return undefined;
}


export function stringToColor(color: string | number = '') : string | undefined {
    console.log(`stringToColor: [${color}]`);
    if(!color){
      return undefined;
    }
    if(typeof color === 'string'){
      if(isHexColor(color)){
        console.log("yeah is color")
        return color;
      }
    }
    if(isNumber(color)){
      if(color.toString().length > 8){
        return argbToRgba(color);
      }
    }
  return undefined;
}


/**
 * Converts a color string to a color number value.
 */
export function hexColor(color: string | number = ''): number {
  console.log(`hexColor: [${color}]`);
  if (isInteger(color)) {
    return color;
  }

  if (typeof color === 'string') {
    // Renderer expects RGBA values
    if (color.startsWith('#')) {
      return Number(
        color.replace('#', '0x') + (color.length === 7 ? 'ff' : ''),
      );
    }

    if (color.startsWith('0x')) {
      return Number(color);
    }
    return Number('0x' + (color.length === 6 ? color + 'ff' : color));
  }

  return 0x00000000;
}

/**
 * Converts degrees to radians
 */
export function deg2rad(deg: number) {
  return (deg * Math.PI) / 180;
}
