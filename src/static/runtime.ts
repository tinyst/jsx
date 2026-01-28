import type { JSX } from "./types.js";

export type * from "./types.js";

export const jsx = (type: Function | string | undefined, props: Record<string, any>): JSX.Element => {
  return { type, props };
}

export const Fragment = (props: Record<string, any>): JSX.Element => {
  return { type: undefined, props };
}

export const jsxs = jsx;
export const jsxDEV = jsx;
