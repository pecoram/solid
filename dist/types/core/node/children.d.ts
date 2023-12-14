import type { ElementNode, SolidNode } from './index.js';
/**
 * Children class
 */
export default class Children extends Array<SolidNode> {
    _parent: ElementNode;
    constructor(node: ElementNode);
    get selected(): ElementNode | undefined;
    get firstChild(): SolidNode;
    insert(node: SolidNode, beforeNode: SolidNode): void;
    remove(node: SolidNode): void;
}
