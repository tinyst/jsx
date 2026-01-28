import { JSX_SYMBOL } from "../constants.js";
import type { JSX } from "./types.js";

export type * from "./types.js";

export const jsx = (type: Function | string | undefined, props: Record<string, any>): JSX.Element => {
  return { [JSX_SYMBOL]: true, type, props };
}

export const Fragment = (props: Record<string, any>): JSX.Element => {
  return { [JSX_SYMBOL]: true, type: undefined, props };
}

export const jsxs = jsx;
export const jsxDEV = jsx;
