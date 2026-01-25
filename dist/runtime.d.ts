import type { JSX, JsxComponent } from "./types.js";
export type * from "./types.js";
export declare const jsx: (type: JsxComponent<any> | string | undefined, props: Record<string, any>) => JSX.Element;
export declare const Fragment: (props: Record<string, any>) => JSX.Element;
export declare const jsxs: (type: JsxComponent<any> | string | undefined, props: Record<string, any>) => JSX.Element;
export declare const jsxDEV: (type: JsxComponent<any> | string | undefined, props: Record<string, any>) => JSX.Element;
