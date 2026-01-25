import type { JSX, JsxElementCreateInput, JsxFragmentCreateInput, JsxValueCreateInput, JsxWalkHandlers } from "./types.js";
export type * from "./types.js";
export declare function createJsxElement(input: JsxElementCreateInput | JsxFragmentCreateInput | JsxValueCreateInput): JSX.Element;
export declare function isJsxElement(el: any): el is JSX.Element;
export declare function walkJsxElement(element: JSX.Element, handlers: JsxWalkHandlers): void;
export declare function renderToString(element: JSX.Element): string;
