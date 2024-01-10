import { createSignal, createEffect, mergeProps as mergeProps$1, createRoot, createRenderEffect, createMemo, createComponent as createComponent$1, untrack } from 'solid-js';
export { ErrorBoundary, For, Index, Match, Show, Suspense, SuspenseList, Switch } from 'solid-js';
import { MainRenderDriver, RendererMain } from '@lightningjs/renderer';
import { createElement as createElement$1, spread as spread$1, use as use$1, setProp as setProp$1, insert as insert$1 } from '@lightningjs/solid';

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

const [activeElement, setActiveElement] = createSignal(null);

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

let renderer;
let createShader;
function startLightningRenderer(options = {}) {
  const driver = new MainRenderDriver();
  renderer = new RendererMain(options, options.rootId || 'app', driver);
  createShader = renderer.createShader.bind(renderer);
  return renderer;
}

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

/**
 * Children class
 */
class Children extends Array {
  constructor(node) {
    super();
    this._parent = node;
  }
  get selected() {
    // For selected Elements should always be an ElementNode
    return this[this._parent.selected || 0];
  }
  get firstChild() {
    return this[0];
  }
  insert(node, beforeNode) {
    if (beforeNode) {
      const index = this.indexOf(beforeNode);
      this.splice(index, 0, node);
    } else {
      this.push(node);
    }
    node.parent = this._parent;
    this._parent._isDirty = true;
  }
  remove(node) {
    const nodeIndexToRemove = this.indexOf(node);
    if (nodeIndexToRemove >= 0) {
      this.splice(nodeIndexToRemove, 1);
    }
  }
}

/*
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2023 Comcast
 *
 * Licensed under the Apache License, Version 2.0 (the License);
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
 */

import.meta.env = import.meta.env || {
  MODE: 'development'
};
const isDev = import.meta.env.MODE === 'development';
const config = {
  debug: false,
  animationSettings: {
    duration: 250,
    easing: 'ease-in-out'
  },
  fontSettings: {
    fontFamily: 'Ubuntu',
    fontSize: 100
  }
};

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

function log(msg, node, ...args) {
  if (isDev) {
    if (config.debug || isObject(node) && node.debug) {
      console.log(msg, node, ...args);
    }
  }
}
function isFunc(item) {
  return typeof item === 'function';
}
function isObject(item) {
  return typeof item === 'object';
}
function isArray(item) {
  return Array.isArray(item);
}
function isString(item) {
  return typeof item === 'string';
}
function isNumber(item) {
  return typeof item === 'number';
}
function isInteger(item) {
  return Number.isInteger(item);
}
function keyExists(obj, keys) {
  for (const key of keys) {
    if (key in obj) {
      return true;
    }
  }
  return false;
}
function getAnimatableValue(value) {
  return isArray(value) ? value[0] : value;
}

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

class States extends Array {
  constructor(callback, initialState = {}) {
    if (isArray(initialState)) {
      super(...initialState);
    } else if (isString(initialState)) {
      super(initialState);
    } else {
      super(...Object.entries(initialState).filter(([_key, value]) => value).map(([key]) => key));
    }
    this.onChange = callback;
    return this;
  }
  has(state) {
    return this.indexOf(state) >= 0;
  }
  is(state) {
    return this.indexOf(state) >= 0;
  }
  add(state) {
    this.push(state);
    this.onChange();
  }
  toggle(state) {
    if (this.has(state)) {
      this.remove(state);
    } else {
      this.add(state);
    }
  }
  remove(state) {
    const stateIndexToRemove = this.indexOf(state);
    if (stateIndexToRemove >= 0) {
      this.splice(stateIndexToRemove, 1);
      this.onChange();
    }
  }
}

/*
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2023 Comcast Cable Communications Management, LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the License);
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
 */
/**
 * Asserts a condition is truthy, otherwise throws an error
 *
 * @remarks
 * Useful at the top of functions to ensure certain conditions, arguments and
 * properties are set/met before continuing. When using this function,
 * TypeScript will narrow away falsy types from the condition.
 *
 * @param condition
 * @param message
 * @returns
 */
function assertTruthy(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

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
function calculateFlex (node) {
  const children = [];
  for (let i = 0; i < node.children.length; i++) {
    const c = node.children[i];
    // Filter empty text nodes which are place holders for <Show> and elements missing dimensions
    if (c.name === 'TextNode') {
      continue;
    }
    // text node hasnt loaded yet - skip layout
    if (c.name === 'text' && !(c.width || c.height)) {
      return false;
    }
    children.push(c);
  }
  const numChildren = children.length;
  const direction = node.flexDirection || 'row';
  const isRow = direction === 'row';
  const dimension = isRow ? 'width' : 'height';
  const crossDimension = isRow ? 'height' : 'width';
  const marginOne = isRow ? 'marginLeft' : 'marginTop';
  const marginTwo = isRow ? 'marginRight' : 'marginBottom';
  const prop = isRow ? 'x' : 'y';
  const crossProp = isRow ? 'y' : 'x';
  const containerSize = node[dimension] || 0;
  const containerCrossSize = node[crossDimension] || 0;
  const gap = node.gap || 0;
  const justify = node.justifyContent || 'flexStart';
  const align = node.alignItems;
  let itemSize = 0;
  if (['center', 'spaceBetween', 'spaceEvenly'].includes(justify)) {
    itemSize = children.reduce((prev, c) => prev + (c[dimension] || 0), 0);
  }

  // Only align children if container has a cross size
  const crossAlignChild = containerCrossSize && align ? c => {
    if (align === 'flexStart') {
      c[crossProp] = 0;
    } else if (align === 'center') {
      c[crossProp] = (containerCrossSize - (c[crossDimension] || 0)) / 2;
    } else if (align === 'flexEnd') {
      c[crossProp] = containerCrossSize - (c[crossDimension] || 0);
    }
  } : c => c;
  if (justify === 'flexStart') {
    let start = 0;
    children.forEach(c => {
      c[prop] = start + (c[marginOne] || 0);
      start += (c[dimension] || 0) + gap + (c[marginOne] || 0) + (c[marginTwo] || 0);
      crossAlignChild(c);
    });
    // Update container size
    if (node._autosized) {
      const containerSize = start - gap;
      if (containerSize !== node[dimension]) {
        node[dimension] = containerSize;
        return true;
      }
    }
  } else if (justify === 'flexEnd') {
    let start = containerSize;
    for (let i = numChildren - 1; i >= 0; i--) {
      const c = children[i];
      assertTruthy(c);
      c[prop] = start - (c[dimension] || 0) - (c[marginTwo] || 0);
      start -= (c[dimension] || 0) + gap + (c[marginOne] || 0) + (c[marginTwo] || 0);
      crossAlignChild(c);
    }
  } else if (justify === 'center') {
    let start = (containerSize - (itemSize + gap * (numChildren - 1))) / 2;
    children.forEach(c => {
      c[prop] = start;
      start += (c[dimension] || 0) + gap;
      crossAlignChild(c);
    });
  } else if (justify === 'spaceBetween') {
    const toPad = (containerSize - itemSize) / (numChildren - 1);
    let start = 0;
    children.forEach(c => {
      c[prop] = start;
      start += (c[dimension] || 0) + toPad;
      crossAlignChild(c);
    });
  } else if (justify === 'spaceEvenly') {
    const toPad = (containerSize - itemSize) / (numChildren + 1);
    let start = toPad;
    children.forEach(c => {
      c[prop] = start;
      start += (c[dimension] || 0) + toPad;
      crossAlignChild(c);
    });
  }

  // Container was not updated
  return false;
}

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

const {
  animationSettings: defaultAnimationSettings
} = config;
function convertEffectsToShader(styleEffects) {
  const effects = [];
  for (const [type, props] of Object.entries(styleEffects)) {
    effects.push({
      type,
      props
    });
  }
  return createShader('DynamicShader', {
    effects: effects
  });
}
function borderAccessor(direction = '') {
  return {
    set(value) {
      // Format: width || { width, color }
      if (isNumber(value)) {
        value = {
          width: value,
          color: 0x000000ff
        };
      }
      this.effects = {
        ...(this.effects || {}),
        ...{
          [`border${direction}`]: value
        }
      };
      this[`_border${direction}`] = value;
    },
    get() {
      return this[`_border${direction}`];
    }
  };
}
const LightningRendererNumberProps = ['alpha', 'color', 'colorTop', 'colorRight', 'colorLeft', 'colorBottom', 'colorTl', 'colorTr', 'colorBl', 'colorBr', 'height', 'fontSize', 'lineHeight', 'mount', 'mountX', 'mountY', 'pivot', 'pivotX', 'pivotY', 'rotation', 'scale', 'width', 'worldX', 'worldY', 'x', 'y', 'zIndex', 'zIndexLocked'];
const LightningRendererNonAnimatingProps = ['clipping', 'contain', 'fontFamily', 'src', 'text', 'textAlign', 'texture', 'maxLines', 'maxLinesSuffix', 'textOverflow', 'verticalAlign', 'textBaseline', 'wordWrap'];

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
class ElementNode extends Object {
  lng = null;
  _parent = null;

  // Public but uses _ prefix
  // Public but uses _ prefix
  // Public but uses _ prefix
  /**
   * Managed by dom-inspector
   */
  // Public but uses _ prefix
  constructor(name) {
    super();
    this.name = name;
    this.rendered = false;
    this.autofocus = false;
    this._renderProps = {
      x: 0,
      y: 0
    };
    this.children = new Children(this);
    for (const key of LightningRendererNumberProps) {
      Object.defineProperty(this, key, {
        get() {
          return this[`_${key}`] || this.lng && this.lng[key];
        },
        set(v) {
          this[`_${key}`] = getAnimatableValue(v);
          this._sendToLightningAnimatable(key, v);
        }
      });
    }
    for (const key of LightningRendererNonAnimatingProps) {
      Object.defineProperty(this, key, {
        get() {
          return this[`_${key}`] || this.lng && this.lng[key];
        },
        set(v) {
          this[`_${key}`] = v;
          this._sendToLightning(key, v);
        }
      });
    }

    // Add Border Helpers
    Object.defineProperties(this, {
      borderRadius: {
        set(radius) {
          this._borderRadius = radius;
          this.effects = {
            ...(this.effects || {}),
            ...{
              radius: {
                radius
              }
            }
          };
        },
        get() {
          return this._borderRadius;
        }
      },
      border: borderAccessor(),
      borderLeft: borderAccessor('Left'),
      borderRight: borderAccessor('Right'),
      borderTop: borderAccessor('Top'),
      borderBottom: borderAccessor('Bottom')
    });
    Object.defineProperties(this, {
      linearGradient: {
        set(props = {}) {
          this._linearGradient = props;
          this.effects = {
            ...(this.effects || {}),
            ...{
              linearGradient: props
            }
          };
        },
        get() {
          return this._linearGradient;
        }
      }
    });
  }
  get effects() {
    return this._effects;
  }
  set effects(v) {
    this._effects = v;
    this.shader = convertEffectsToShader(v);
  }
  get parent() {
    return this._parent;
  }
  set parent(p) {
    this._parent = p;
    if (this.rendered && this.lng) {
      this.lng.parent = p?.lng ?? null;
    }
  }
  get shader() {
    return this._shader;
  }
  set shader(v) {
    if (isArray(v)) {
      this._shader = createShader(...v);
    } else {
      this._shader = v;
    }
    this._sendToLightning('shader', this._shader);
  }
  _sendToLightningAnimatable(name, value) {
    if (this.rendered && this.lng) {
      if (isArray(value)) {
        return this.createAnimation({
          [name]: value[0]
        }, value[1]).start();
      }
      if (this._animate) {
        return this.createAnimation({
          [name]: value
        }).start();
      }
      this.lng[name] = value;
    } else {
      // Need to render before animating
      if (isArray(value)) {
        value = value[0];
      }
      this._renderProps[name] = value;
    }
  }
  _sendToLightning(name, value) {
    if (this.rendered && this.lng) {
      this.lng[name] = value;
    } else {
      this._renderProps[name] = value;
    }
  }
  createAnimation(props, animationSettings) {
    assertTruthy(this.lng, 'Node must be rendered before animating');
    return this.lng.animate(props, animationSettings || this.animationSettings);
  }
  setFocus() {
    if (this.rendered) {
      // Delay setting focus so children can render (useful for Row + Column)
      queueMicrotask(() => setActiveElement(this));
    } else {
      this.autofocus = true;
    }
  }
  isTextNode() {
    return this.name === 'text';
  }
  _resizeOnTextLoad() {
    this.lng.once('loaded', (_node, loadedPayload) => {
      if (loadedPayload.type === 'text') {
        const {
          dimensions
        } = loadedPayload;
        this.width = dimensions.width;
        this.height = dimensions.height;
        this.parent.updateLayout(this, dimensions);
      }
    });
  }
  getText() {
    return this.children.map(c => c.text).join('');
  }
  destroy() {
    this.lng && renderer.destroyNode(this.lng);
  }
  set style(value) {
    // Keys set in JSX are more important
    for (let key in value) {
      if (key === 'animate') {
        key = '_animate';
      }
      if (!this[key]) {
        this[key] = value[key];
      }
    }
    this._style = value;
  }
  get style() {
    return this._style;
  }
  get hasChildren() {
    return this.children.length > 0;
  }
  set states(states) {
    this._states = new States(this._stateChanged.bind(this), states);
    if (this.rendered) {
      this._stateChanged();
    }
  }
  get states() {
    this._states = this._states || new States(this._stateChanged.bind(this));
    return this._states;
  }
  get animationSettings() {
    return this._animationSettings || defaultAnimationSettings;
  }
  set animationSettings(animationSettings) {
    this._animationSettings = animationSettings;
  }
  _applyZIndexToChildren() {
    const zIndex = this.zIndex;
    const zIndexIsInteger = zIndex >= 1 && parseInt('' + zIndex) === zIndex;
    const decimalSeparator = zIndexIsInteger ? '.' : '';
    this.children.forEach((c, i) => {
      if (!c.zIndex || c.zIndex < 1) {
        c.zIndex = parseFloat(`${zIndex}${decimalSeparator}${i + 1}`);
      }
    });
  }
  updateLayout(child, dimensions) {
    if (this.hasChildren) {
      log('Layout: ', this);
      isFunc(this.onBeforeLayout) && this.onBeforeLayout.call(this, child, dimensions);
      if (this.display === 'flex') {
        calculateFlex(this);
      }
      isFunc(this.onLayout) && this.onLayout.call(this, child, dimensions);
    }
  }
  _stateChanged() {
    log('State Changed: ', this, this.states);
    if (this.forwardStates) {
      // apply states to children first
      const states = this.states.slice();
      this.children.forEach(c => c.states = states);
    }
    const states = config.stateMapperHook?.(this, this.states) || this.states;
    if (this._undoStates || this.style && keyExists(this.style, states)) {
      this._undoStates = this._undoStates || {};
      let stylesToUndo = {};
      for (const [state, undoStyles] of Object.entries(this._undoStates)) {
        // if state is no longer in the states undo it
        if (!states.includes(state)) {
          stylesToUndo = {
            ...stylesToUndo,
            ...undoStyles
          };
        }
      }
      const newStyles = states.reduce((acc, state) => {
        const styles = this.style[state];
        if (styles) {
          acc = {
            ...acc,
            ...styles
          };

          // get current values to undo state
          if (this._undoStates && !this._undoStates[state]) {
            this._undoStates[state] = {};
            Object.keys(styles).forEach(key => {
              this._undoStates[state][key] = this[key];
            });
          }
        }
        return acc;
      }, {});

      // Apply the styles
      Object.assign(this, {
        ...stylesToUndo,
        ...newStyles
      });
    }
  }
  render() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const node = this;
    const parent = this.parent;

    // Parent is dirty whenever a node is inserted after initial render
    if (parent._isDirty) {
      parent.updateLayout();
      parent._applyZIndexToChildren();
      parent._isDirty = false;
    }
    node.updateLayout();
    if (this.states.length) {
      this._stateChanged();
    }
    let props = node._renderProps;
    if (parent.lng) {
      props.parent = parent.lng;
    }
    if (node.isTextNode()) {
      props = {
        ...config.fontSettings,
        ...props,
        text: node.getText()
      };

      // if (props.contain) {
      //   if (!props.width) {
      //     props.width =
      //       (parent.width || 0) - props.x - (props.marginRight || 0);
      //     node._width = props.width;
      //     node._autosized = true;
      //   }

      //   if (!props.height && props.contain === 'both') {
      //     props.height =
      //       (parent.height || 0) - props.y - (props.marginBottom || 0);
      //     node._height = props.height;
      //     node._autosized = true;
      //   }
      // }

      log('Rendering: ', this, props);
      node.lng = renderer.createTextNode(props);
      isFunc(this.onCreate) && this.onCreate.call(this, node);
      if (isFunc(node.onLoad)) {
        node.lng.on('loaded', node.onLoad);
      }
      if (!node.width || !node.height) {
        node._autosized = true;
        node._resizeOnTextLoad();
      }
    } else {
      // If its not an image or texture apply some defaults
      if (!(props.src || props.texture)) {
        // Set width and height to parent less offset
        if (isNaN(props.width)) {
          props.width = (parent.width || 0) - props.x;
          node._width = props.width;
          node._autosized = true;
        }
        if (isNaN(props.height)) {
          props.height = (parent.height || 0) - props.y;
          node._height = props.height;
          node._autosized = true;
        }
        if (!props.color) {
          // Default color to transparent - If you later set a src, you'll need
          // to set color '#ffffffff'
          node._color = props.color = 0x00000000;
        }
      }
      log('Rendering: ', this, props);
      node.hasChildren && node._applyZIndexToChildren();
      node.lng = renderer.createNode(props);
      if (node.onFail) {
        node.lng.on('failed', node.onFail);
      }
      if (node.onLoad) {
        node.lng.on('loaded', node.onLoad);
      }
      isFunc(this.onCreate) && this.onCreate.call(this, node);
    }
    node.rendered = true;
    node.autofocus && node.setFocus();
    // clean up after first render;
    delete this._renderProps;
  }
}

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

const Text = props => (() => {
  const _el$ = createElement$1("text");
  spread$1(_el$, props, false);
  return _el$;
})();

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

const View = props => (() => {
  const _el$ = createElement$1("node");
  spread$1(_el$, props, false);
  return _el$;
})();

function renderTopDown(node) {
  if (node.name === 'TextNode') {
    return;
  }
  assertTruthy(node instanceof ElementNode);
  node.render();
  node.children.forEach(c => renderTopDown(c));
}
const Canvas = props => {
  const renderer = startLightningRenderer(props.options);
  const init = renderer.init();
  let root;
  createEffect(() => {
    init.then(() => {
      assertTruthy(root);
      root.lng = renderer.root;
      root.children.forEach(renderTopDown);
      isFunc(props.onFirstRender) && props.onFirstRender(root);
    }).catch(console.error);
  });
  return (() => {
    const _el$ = createElement$1("canvas");
    const _ref$ = root;
    typeof _ref$ === "function" ? use$1(_ref$, _el$) : root = _el$;
    setProp$1(_el$, "zIndex", 0.1);
    insert$1(_el$, () => props.children);
    return _el$;
  })();
};

function createRenderer$1({
  createElement,
  createTextNode,
  isTextNode,
  replaceText,
  insertNode,
  removeNode,
  setProperty,
  getParentNode,
  getFirstChild,
  getNextSibling
}) {
  function insert(parent, accessor, marker, initial) {
    if (marker !== undefined && !initial) initial = [];
    if (typeof accessor !== "function") return insertExpression(parent, accessor, initial, marker);
    createRenderEffect(current => insertExpression(parent, accessor(), current, marker), initial);
  }
  function insertExpression(parent, value, current, marker, unwrapArray) {
    while (typeof current === "function") current = current();
    if (value === current) return current;
    const t = typeof value,
      multi = marker !== undefined;
    if (t === "string" || t === "number") {
      if (t === "number") value = value.toString();
      if (multi) {
        let node = current[0];
        if (node && isTextNode(node)) {
          replaceText(node, value);
        } else node = createTextNode(value);
        current = cleanChildren(parent, current, marker, node);
      } else {
        if (current !== "" && typeof current === "string") {
          replaceText(getFirstChild(parent), current = value);
        } else {
          cleanChildren(parent, current, marker, createTextNode(value));
          current = value;
        }
      }
    } else if (value == null || t === "boolean") {
      current = cleanChildren(parent, current, marker);
    } else if (t === "function") {
      createRenderEffect(() => {
        let v = value();
        while (typeof v === "function") v = v();
        current = insertExpression(parent, v, current, marker);
      });
      return () => current;
    } else if (Array.isArray(value)) {
      const array = [];
      if (normalizeIncomingArray(array, value, unwrapArray)) {
        createRenderEffect(() => current = insertExpression(parent, array, current, marker, true));
        return () => current;
      }
      if (array.length === 0) {
        const replacement = cleanChildren(parent, current, marker);
        if (multi) return current = replacement;
      } else {
        if (Array.isArray(current)) {
          if (current.length === 0) {
            appendNodes(parent, array, marker);
          } else reconcileArrays(parent, current, array);
        } else if (current == null || current === "") {
          appendNodes(parent, array);
        } else {
          reconcileArrays(parent, multi && current || [getFirstChild(parent)], array);
        }
      }
      current = array;
    } else {
      if (Array.isArray(current)) {
        if (multi) return current = cleanChildren(parent, current, marker, value);
        cleanChildren(parent, current, null, value);
      } else if (current == null || current === "" || !getFirstChild(parent)) {
        insertNode(parent, value);
      } else replaceNode(parent, value, getFirstChild(parent));
      current = value;
    }
    return current;
  }
  function normalizeIncomingArray(normalized, array, unwrap) {
    let dynamic = false;
    for (let i = 0, len = array.length; i < len; i++) {
      let item = array[i],
        t;
      if (item == null || item === true || item === false) ;else if (Array.isArray(item)) {
        dynamic = normalizeIncomingArray(normalized, item) || dynamic;
      } else if ((t = typeof item) === "string" || t === "number") {
        normalized.push(createTextNode(item));
      } else if (t === "function") {
        if (unwrap) {
          while (typeof item === "function") item = item();
          dynamic = normalizeIncomingArray(normalized, Array.isArray(item) ? item : [item]) || dynamic;
        } else {
          normalized.push(item);
          dynamic = true;
        }
      } else normalized.push(item);
    }
    return dynamic;
  }
  function reconcileArrays(parentNode, a, b) {
    let bLength = b.length,
      aEnd = a.length,
      bEnd = bLength,
      aStart = 0,
      bStart = 0,
      after = getNextSibling(a[aEnd - 1]),
      map = null;
    while (aStart < aEnd || bStart < bEnd) {
      if (a[aStart] === b[bStart]) {
        aStart++;
        bStart++;
        continue;
      }
      while (a[aEnd - 1] === b[bEnd - 1]) {
        aEnd--;
        bEnd--;
      }
      if (aEnd === aStart) {
        const node = bEnd < bLength ? bStart ? getNextSibling(b[bStart - 1]) : b[bEnd - bStart] : after;
        while (bStart < bEnd) insertNode(parentNode, b[bStart++], node);
      } else if (bEnd === bStart) {
        while (aStart < aEnd) {
          if (!map || !map.has(a[aStart])) removeNode(parentNode, a[aStart]);
          aStart++;
        }
      } else if (a[aStart] === b[bEnd - 1] && b[bStart] === a[aEnd - 1]) {
        const node = getNextSibling(a[--aEnd]);
        insertNode(parentNode, b[bStart++], getNextSibling(a[aStart++]));
        insertNode(parentNode, b[--bEnd], node);
        a[aEnd] = b[bEnd];
      } else {
        if (!map) {
          map = new Map();
          let i = bStart;
          while (i < bEnd) map.set(b[i], i++);
        }
        const index = map.get(a[aStart]);
        if (index != null) {
          if (bStart < index && index < bEnd) {
            let i = aStart,
              sequence = 1,
              t;
            while (++i < aEnd && i < bEnd) {
              if ((t = map.get(a[i])) == null || t !== index + sequence) break;
              sequence++;
            }
            if (sequence > index - bStart) {
              const node = a[aStart];
              while (bStart < index) insertNode(parentNode, b[bStart++], node);
            } else replaceNode(parentNode, b[bStart++], a[aStart++]);
          } else aStart++;
        } else removeNode(parentNode, a[aStart++]);
      }
    }
  }
  function cleanChildren(parent, current, marker, replacement) {
    if (marker === undefined) {
      let removed;
      while (removed = getFirstChild(parent)) removeNode(parent, removed);
      replacement && insertNode(parent, replacement);
      return "";
    }
    const node = replacement || createTextNode("");
    if (current.length) {
      let inserted = false;
      for (let i = current.length - 1; i >= 0; i--) {
        const el = current[i];
        if (node !== el) {
          const isParent = getParentNode(el) === parent;
          if (!inserted && !i) isParent ? replaceNode(parent, node, el) : insertNode(parent, node, marker);else isParent && removeNode(parent, el);
        } else inserted = true;
      }
    } else insertNode(parent, node, marker);
    return [node];
  }
  function appendNodes(parent, array, marker) {
    for (let i = 0, len = array.length; i < len; i++) insertNode(parent, array[i], marker);
  }
  function replaceNode(parent, newNode, oldNode) {
    insertNode(parent, newNode, oldNode);
    removeNode(parent, oldNode);
  }
  function spreadExpression(node, props, prevProps = {}, skipChildren) {
    props || (props = {});
    if (!skipChildren) {
      createRenderEffect(() => prevProps.children = insertExpression(node, props.children, prevProps.children));
    }
    createRenderEffect(() => props.ref && props.ref(node));
    createRenderEffect(() => {
      for (const prop in props) {
        if (prop === "children" || prop === "ref") continue;
        const value = props[prop];
        if (value === prevProps[prop]) continue;
        setProperty(node, prop, value, prevProps[prop]);
        prevProps[prop] = value;
      }
    });
    return prevProps;
  }
  return {
    render(code, element) {
      let disposer;
      createRoot(dispose => {
        disposer = dispose;
        insert(element, code());
      });
      return disposer;
    },
    insert,
    spread(node, accessor, skipChildren) {
      if (typeof accessor === "function") {
        createRenderEffect(current => spreadExpression(node, accessor(), current, skipChildren));
      } else spreadExpression(node, accessor, undefined, skipChildren);
    },
    createElement,
    createTextNode,
    insertNode,
    setProp(node, name, value, prev) {
      setProperty(node, name, value, prev);
      return value;
    },
    mergeProps: mergeProps$1,
    effect: createRenderEffect,
    memo: createMemo,
    createComponent: createComponent$1,
    use(fn, element, arg) {
      return untrack(() => fn(element, arg));
    }
  };
}
function createRenderer(options) {
  const renderer = createRenderer$1(options);
  renderer.mergeProps = mergeProps$1;
  return renderer;
}

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
var universalLightning = {
  createElement(name) {
    const node = new ElementNode(name);
    renderer.root && createEffect(() => node.render());
    return node;
  },
  createTextNode(text) {
    // A text node is just a string - not the <text> node
    return {
      name: 'TextNode',
      text,
      parent: null
    };
  },
  replaceText(node, value) {
    log('Replace Text: ', node, value);
    node.text = value;
    const parent = node.parent;
    assertTruthy(parent);
    parent._autosized && parent._resizeOnTextLoad();
    parent.text = parent.getText();
  },
  setProperty(node, name, value = true) {
    if (name === 'animate') {
      node._animate = value;
      return;
    }
    node[name] = value;
  },
  insertNode(parent, node, anchor) {
    log('INSERT: ', parent, node, anchor);
    if (parent) {
      parent.children.insert(node, anchor);
      if (node.name === 'TextNode') {
        // TextNodes can be placed outside of <text> nodes when <Show> is used as placeholder
        if (parent.isTextNode()) {
          parent._autosized && parent._resizeOnTextLoad();
          parent.text = parent.getText();
        }
      }
    }
  },
  isTextNode(node) {
    return node.isTextNode();
  },
  removeNode(parent, node) {
    log('REMOVE: ', parent, node);
    parent.children.remove(node);
    if (node instanceof ElementNode) {
      node.destroy();
    }
  },
  getParentNode(node) {
    return node.parent ?? undefined;
  },
  getFirstChild(node) {
    return node.children[0];
  },
  getNextSibling(node) {
    if (node.parent) {
      const children = node.parent.children || [];
      const index = children.indexOf(node) + 1;
      if (index < children.length) {
        return children[index];
      }
    }
    return undefined;
  }
};

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

const injectCSS = css => {
  const el = document.createElement('style');
  el.innerText = css;
  document.head.appendChild(el);
};
const updateRootStyleFromCanvas = function (canvas) {
  const bcr = canvas.getBoundingClientRect();
  const p = renderer.settings.deviceLogicalPixelRatio || 1; //0.6666667;
  const root = document.getElementById('linspector');
  root.style.left = canvas.offsetLeft + 'px';
  root.style.top = canvas.offsetTop + 'px';
  root.style.width = Math.ceil(bcr.width / p) + 'px';
  root.style.height = Math.ceil(bcr.height / p) + 'px';
  root.style.transformOrigin = '0 0 0';
  root.style.transform = 'scale(' + p + ',' + p + ')';
};
function attachInspector() {
  injectCSS(`
    #linspector {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      zIndex: 5;
      overflow: hidden;
    }
    div.lnode {
      position: absolute;
      display: inline-block;
    }
    .ltext {
      visibility: hidden;
    }
  `);
  setTimeout(function () {
    updateRootStyleFromCanvas(renderer.canvas);
  }, 1000);
}
var universalInspector = {
  ...universalLightning,
  createElement(name) {
    const dom = document.createElement('div');
    if (name === 'canvas') {
      dom.id = 'linspector';
      assertTruthy(renderer.canvas.parentNode);
      renderer.canvas.parentNode.appendChild(dom);
    } else {
      dom.classList.add('lnode');
    }
    if (name === 'text') {
      dom.classList.add('ltext');
    }
    const node = universalLightning.createElement(name);
    if (name !== 'canvas') {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      const origRender = node.render;
      node.render = () => {
        origRender.call(node);
        if (node.id) {
          dom.id = node.id;
        }
        if (node.clipping) {
          dom.style.overflow = 'hidden';
        }
        dom.style.width = node.width + 'px';
        dom.style.height = node.height + 'px';
        dom.style.top = node.y + 'px';
        dom.style.left = node.x + 'px';
        dom.style.zIndex = `${node.zIndex}`;
      };
    }
    node._dom = dom;
    // TODO: WeakMap might be a good idea instead augmenting properties onto HTMLDivElement
    dom.solid = node;
    return node;
  },
  setProperty(node, name, value = true) {
    if (name === 'width') {
      node._dom.style.width = value + 'px';
    } else if (name === 'height') {
      node._dom.style.height = value + 'px';
    } else if (name === 'y') {
      node._dom.style.top = value + 'px';
    } else if (name === 'x') {
      node._dom.style.left = value + 'px';
    } else if (name === 'zIndex') {
      node._dom.style.zIndex = value;
    }
    universalLightning.setProperty(node, name, value);
  },
  createTextNode(text) {
    const dom = document.createTextNode(text);
    const node = universalLightning.createTextNode(text);
    node._dom = dom;
    return node;
  },
  replaceText(textNode, value) {
    universalLightning.replaceText(textNode, value);
    textNode._dom.data = value;
  },
  insertNode(parent, node, anchor) {
    if (parent) {
      if (anchor && parent._dom === anchor._dom.parentNode) {
        parent._dom.insertBefore(node._dom, anchor._dom);
      } else {
        parent._dom.appendChild(node._dom);
      }
      universalLightning.insertNode(parent, node, anchor);
    }
  },
  removeNode(parent, node) {
    parent._dom.removeChild(node._dom);
    universalLightning.removeNode(parent, node);
  }
};

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

const loadInspector = isDev;
if (loadInspector) {
  attachInspector();
}
const solidRenderer = createRenderer(loadInspector ? universalInspector : universalLightning);

// TODO: This is a hack to get the `render()` function to work as it is used now in the demo app
// There's gotta be a better way to fix it
const render = solidRenderer.render;
const {
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
} = solidRenderer;

var intrinsicTypes = /*#__PURE__*/Object.freeze({
  __proto__: null
});

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


/**
 * Converts a color string to a color number value.
 */
function hexColor(color = '') {
  if (isInteger(color)) {
    return color;
  }
  if (typeof color === 'string') {
    // Renderer expects RGBA values
    if (color.startsWith('#')) {
      return Number(color.replace('#', '0x') + (color.length === 7 ? 'ff' : ''));
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
function deg2rad(deg) {
  return deg * Math.PI / 180;
}

export { Canvas, config as Config, ElementNode, Text, intrinsicTypes as Types, View, activeElement, createComponent, createElement, createShader, createTextNode, deg2rad, effect, hexColor, insert, insertNode, memo, mergeProps, render, renderer, setActiveElement, setProp, spread, startLightningRenderer, use };
//# sourceMappingURL=index.js.map
