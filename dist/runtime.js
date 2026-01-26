import { createJsxNode, isJsxNode } from "./main.js";
function isIterableOrArray(value) {
    return Array.isArray(value) || (value && typeof value === "object" && typeof value[Symbol.iterator] === "function");
}
function parseChildren(children) {
    const iterable = isIterableOrArray(children) ? children : [children];
    const elements = [];
    for (const child of iterable) {
        if (typeof child === "undefined" || child === null) {
            continue;
        }
        else if (typeof child === "string" || typeof child === "number" || typeof child === "boolean") {
            elements.push(createJsxNode({
                kind: "primitive",
                value: child,
            }));
        }
        else if (isJsxNode(child)) {
            // this is jsx node from our jsx parser
            elements.push(child);
        }
        else {
            // can be symbol, function, object, bigint, or developer-defined custom value
            elements.push(createJsxNode({
                kind: "custom",
                value: child,
            }));
        }
    }
    return elements;
}
function parseAttributes(props) {
    if (!props) {
        return {};
    }
    const attrs = {};
    for (const key in props) {
        if (key === "children") {
            // skip children because it's already parsed separately
            continue;
        }
        const value = props[key];
        if (typeof value === "undefined" || value === null || value === false) {
            // skip undefined, null, false values (if you want to show key="false" as attr value, make attr value a string "false")
            continue;
        }
        if (value === true) {
            attrs[key] = true;
        }
        else {
            attrs[key] = value;
        }
    }
    return attrs;
}
function parse(type, props) {
    if (typeof type === "function") {
        return parse(undefined, {
            children: type(props ?? {}),
        });
    }
    if (typeof type === "string") {
        return createJsxNode({
            kind: "element",
            name: type,
            attrs: parseAttributes(props),
            children: parseChildren(props?.children),
        });
    }
    return createJsxNode({
        kind: "fragment",
        children: parseChildren(props?.children),
    });
}
export const jsx = (type, props) => {
    return parse(type, props);
};
export const Fragment = (props) => {
    return parse(undefined, props);
};
export const jsxs = jsx;
export const jsxDEV = jsx;
