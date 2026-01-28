import { JSX_SYMBOL, ROOT_TAGS, SELF_CLOSING_TAGS } from "./constants.js";
import { escapeHTML } from "./helpers.js";
// --- HELPER ---
export function createJsxNode(input) {
    return {
        [JSX_SYMBOL]: true,
        ...input,
    };
}
export function isJsxNode(node) {
    return node && typeof node === "object" && JSX_SYMBOL in node;
}
export function jsxNodeWalk(node, handler) {
    handler.enter?.(node);
    if (node.kind === "element" || node.kind === "fragment") {
        for (const child of node.children) {
            jsxNodeWalk(child, handler);
        }
    }
    else if (node.kind === "custom") {
        if (isJsxNode(node.value)) {
            jsxNodeWalk(node.value, handler);
        }
    }
    handler.exit?.(node);
}
// --- RENDER ---
function renderCustomValue(value) {
    if (isJsxNode(value)) {
        return renderToString(value);
    }
    // developer who using this jsx runtime may custom data type but forgot to handle it
    throw new Error(`unsupported value type: ${typeof value}`);
}
function renderPrimitive(value) {
    if (typeof value === "string") {
        return value;
    }
    return String(value);
}
function renderChildren(elements) {
    let text = "";
    for (const element of elements) {
        text += renderToString(element);
    }
    return text;
}
function renderAttributes(attrs) {
    let text = "";
    for (const key in attrs) {
        const value = attrs[key];
        if (typeof value === "undefined" || value === null) {
            continue;
        }
        if (value === true) {
            text += ` ${key}`;
        }
        else if (typeof value === "string") {
            text += ` ${key}="${value}"`;
        }
        else if (typeof value === "number" || Symbol.toPrimitive in value) {
            text += ` ${key}="${String(value)}"`;
        }
        else if (typeof value === "object") {
            text += ` ${key}="${escapeHTML(JSON.stringify(value))}"`;
        }
    }
    return text;
}
function renderElement(element) {
    let text = "";
    if (ROOT_TAGS.has(element.name)) {
        text += "<!DOCTYPE html>";
    }
    text += `<${element.name}${renderAttributes(element.attrs)}>`;
    if (!SELF_CLOSING_TAGS.has(element.name)) {
        text += renderChildren(element.children) + `</${element.name}>`;
    }
    return text;
}
export function renderToString(element) {
    switch (element.kind) {
        case "element":
            return renderElement(element);
        case "fragment":
            return renderChildren(element.children);
        case "primitive":
            return renderPrimitive(element.value);
        case "custom":
            return renderCustomValue(element.value);
    }
}
