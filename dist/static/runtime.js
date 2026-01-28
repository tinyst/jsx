export const jsx = (type, props) => {
    return { type, props };
};
export const Fragment = (props) => {
    return { type: undefined, props };
};
export const jsxs = jsx;
export const jsxDEV = jsx;
