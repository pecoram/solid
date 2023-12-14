import { ElementNode, type SolidNode, type TextNode } from '../node/index.js';
import type { createRenderer } from 'solid-js/universal';
export type SolidRendererOptions = Parameters<typeof createRenderer<SolidNode>>[0];
declare const _default: {
    createElement(name: string): ElementNode;
    createTextNode(text: string): TextNode;
    replaceText(node: TextNode, value: string): void;
    setProperty<T>(node: ElementNode, name: string, value?: any): void;
    insertNode(parent: ElementNode, node: SolidNode, anchor: SolidNode): void;
    isTextNode(node: ElementNode): boolean;
    removeNode(parent: ElementNode, node: SolidNode): void;
    getParentNode(node: SolidNode): ElementNode | undefined;
    getFirstChild(node: ElementNode): SolidNode | undefined;
    getNextSibling(node: SolidNode): SolidNode | undefined;
};
export default _default;
