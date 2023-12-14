import type { ElementNode, SolidNode, TextNode } from '../node/index.js';
export declare function attachInspector(): void;
declare const _default: {
    createElement(name: string): ElementNode;
    setProperty<T>(node: ElementNode, name: string, value?: any): void;
    createTextNode(text: string): TextNode;
    replaceText(textNode: TextNode, value: string): void;
    insertNode(parent: ElementNode, node: SolidNode, anchor: SolidNode): void;
    removeNode(parent: ElementNode, node: SolidNode): void;
    isTextNode(node: ElementNode): boolean;
    getParentNode(node: SolidNode): ElementNode;
    getFirstChild(node: ElementNode): SolidNode;
    getNextSibling(node: SolidNode): SolidNode;
};
export default _default;
