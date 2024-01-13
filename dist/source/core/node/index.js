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
import { renderer, createShader } from '../renderer/index.js';
import Children from './children.js';
import States from './states.js';
import calculateFlex from '../flex.js';
import { log, isArray, isNumber, isFunc, keyExists, getAnimatableValue, } from '../utils.js';
import { config } from '../../config.js';
import { setActiveElement } from '../activeElement.js';
import { assertTruthy } from '@lightningjs/renderer/utils';
const { animationSettings: defaultAnimationSettings } = config;
function convertEffectsToShader(styleEffects) {
    const effects = [];
    for (const [type, props] of Object.entries(styleEffects)) {
        effects.push({ type, props });
    }
    return createShader('DynamicShader', { effects: effects });
}
function borderAccessor(direction = '') {
    return {
        set(value) {
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
        get() {
            return this[`_border${direction}`];
        },
    };
}
const LightningRendererNumberProps = [
    'alpha',
    'color',
    'colorTop',
    'colorRight',
    'colorLeft',
    'colorBottom',
    'colorTl',
    'colorTr',
    'colorBl',
    'colorBr',
    'height',
    'fontSize',
    'lineHeight',
    'mount',
    'mountX',
    'mountY',
    'pivot',
    'pivotX',
    'pivotY',
    'rotation',
    'scale',
    'width',
    'worldX',
    'worldY',
    'x',
    'y',
    'zIndex',
    'zIndexLocked',
];
const LightningRendererNonAnimatingProps = [
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
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class ElementNode extends Object {
    name;
    lng = null;
    selected;
    rendered;
    autofocus;
    _undoStates;
    _renderProps;
    _effects;
    _parent = null;
    _shader;
    _style;
    _states;
    _animationSettings;
    _width;
    _height;
    _color;
    _borderRadius;
    _border;
    _borderLeft;
    _borderRight;
    _borderTop;
    _borderBottom;
    _animate; // Public but uses _ prefix
    _autosized; // Public but uses _ prefix
    _isDirty; // Public but uses _ prefix
    /**
     * Managed by dom-inspector
     */
    _dom; // Public but uses _ prefix
    children;
    constructor(name) {
        super();
        this.name = name;
        this.rendered = false;
        this.autofocus = false;
        this._renderProps = { x: 0, y: 0 };
        this.children = new Children(this);
        for (const key of LightningRendererNumberProps) {
            Object.defineProperty(this, key, {
                get() {
                    return this[`_${key}`] || (this.lng && this.lng[key]);
                },
                set(v) {
                    this[`_${key}`] = getAnimatableValue(v);
                    this._sendToLightningAnimatable(key, v);
                },
            });
        }
        for (const key of LightningRendererNonAnimatingProps) {
            Object.defineProperty(this, key, {
                get() {
                    return this[`_${key}`] || (this.lng && this.lng[key]);
                },
                set(v) {
                    this[`_${key}`] = v;
                    this._sendToLightning(key, v);
                },
            });
        }
        // Add Border Helpers
        Object.defineProperties(this, {
            borderRadius: {
                set(radius) {
                    this._borderRadius = radius;
                    this.effects = {
                        ...(this.effects || {}),
                        ...{ radius: { radius } },
                    };
                },
                get() {
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
        }
        else {
            this._shader = v;
        }
        this._sendToLightning('shader', this._shader);
    }
    _sendToLightningAnimatable(name, value) {
        if (this.rendered && this.lng) {
            if (config.animationsEnabled) {
                if (isArray(value)) {
                    return this.createAnimation({ [name]: value[0] }, value[1]).start();
                }
                if (this._animate) {
                    return this.createAnimation({ [name]: value }).start();
                }
            }
            if (isArray(value)) {
                value = value[0];
            }
            this.lng[name] = value;
        }
        else {
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
        }
        else {
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
        }
        else {
            this.autofocus = true;
        }
    }
    isTextNode() {
        return this.name === 'text';
    }
    _resizeOnTextLoad() {
        this.lng.once('loaded', (_node, loadedPayload) => {
            if (loadedPayload.type === 'text') {
                const { dimensions } = loadedPayload;
                this.width = dimensions.width;
                this.height = dimensions.height;
                this.parent.updateLayout(this, dimensions);
            }
        });
    }
    getText() {
        return this.children.map((c) => c.text).join('');
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
            const states = this.states.slice();
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
                            this._undoStates[state][key] = this[key];
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
                text: node.getText(),
            };
            if (props.contain) {
                if (!props.width) {
                    props.width =
                        (parent.width || 0) - props.x - (props.marginRight || 0);
                    node._width = props.width;
                    node._autosized = true;
                }
                // if (!props.height && props.contain === 'both') {
                //   props.height =
                //     (parent.height || 0) - props.y - (props.marginBottom || 0);
                //   node._height = props.height;
                //   node._autosized = true;
                // }
            }
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
        }
        else {
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
