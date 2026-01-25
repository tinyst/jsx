import { createJsxNode, isValidJsxNode } from "./main.js";
function parseChildren(children) {
    const childrenArray = Array.isArray(children) ? children : [children];
    const elements = [];
    for (const child of childrenArray) {
        if (typeof child === "undefined" || child === null) {
            continue;
        }
        else if (typeof child === "string" || typeof child === "number" || typeof child === "boolean") {
            elements.push(createJsxNode({
                kind: "value",
                value: child,
            }));
        }
        else if (typeof child === "object") {
            if (isValidJsxNode(child)) {
                elements.push(child);
            }
            else {
                elements.push(createJsxNode({
                    kind: "value",
                    value: child,
                }));
            }
        }
        else {
            throw new Error(`invalid child type: ${typeof child}`);
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
            // ไม่ต้องสนใจ children เพราะมีการ parse แยกต่างหาก
            continue;
        }
        const value = props[key];
        if (typeof value === "undefined" || value === null || value === false) {
            // ไม่ render ค่าที่เป็น undefined, null, false (ถ้าอยากให้แสดง key="false" ให้ attr value เป็น string "false")
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
        return type(props ?? {});
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
