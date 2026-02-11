import { JSX_SYMBOL } from "./constants.js";
export const jsx = (type, props) => {
    return { [JSX_SYMBOL]: true, type, props };
};
export const Fragment = (props) => {
    return { [JSX_SYMBOL]: true, type: undefined, props };
};
export const jsxs = jsx;
export const jsxDEV = jsx;
