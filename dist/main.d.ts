import type { JsxCustomValueNodeCreateInput, JsxElementNodeCreateInput, JsxFragmentNodeCreateInput, JsxNode, JsxNodeWalkHandler, JsxPrimitiveValueNodeCreateInput } from "./types.js";
export type * from "./types.js";
export declare function createJsxNode(input: JsxElementNodeCreateInput | JsxFragmentNodeCreateInput | JsxPrimitiveValueNodeCreateInput | JsxCustomValueNodeCreateInput): JsxNode;
export declare function isJsxNode(node: any): node is JsxNode;
export declare function jsxNodeWalk(node: JsxNode, handler: JsxNodeWalkHandler): void;
export declare function renderToString(element: JsxNode): string;
