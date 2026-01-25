import type { JsxElementNodeCreateInput, JsxFragmentNodeCreateInput, JsxNode, JsxNodeWalkHandlers, JsxValueNodeCreateInput } from "./types.js";
export type * from "./types.js";
export declare function createJsxNode(input: JsxElementNodeCreateInput | JsxFragmentNodeCreateInput | JsxValueNodeCreateInput): JsxNode;
export declare function isJsxNode(node: any): node is JsxNode;
export declare function jsxNodeWalk(node: JsxNode, handlers: JsxNodeWalkHandlers): void;
export declare function renderToString(element: JsxNode): string;
