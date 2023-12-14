/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { config, isDev } from '../config.js';
export function log(msg, node, ...args) {
    if (isDev) {
        if (config.debug || (isObject(node) && node.debug)) {
            console.log(msg, node, ...args);
        }
    }
}
export function isFunc(item) {
    return typeof item === 'function';
}
export function isObject(item) {
    return typeof item === 'object';
}
export function isArray(item) {
    return Array.isArray(item);
}
export function isString(item) {
    return typeof item === 'string';
}
export function isNumber(item) {
    return typeof item === 'number';
}
export function isInteger(item) {
    return Number.isInteger(item);
}
export function keyExists(obj, keys) {
    for (const key of keys) {
        if (key in obj) {
            return true;
        }
    }
    return false;
}
export function getAnimatableValue(value) {
    return isArray(value) ? value[0] : value;
}
