export type NodeStates = string[] | string | Record<string, boolean | undefined>;
export default class States extends Array<string> {
    private onChange;
    constructor(callback: () => void, initialState?: NodeStates);
    has(state: string): boolean;
    is(state: string): boolean;
    add(state: string): void;
    toggle(state: string): void;
    remove(state: string): void;
}
