import { JSX_SYMBOL } from "./constants.js";
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
export function jsxNodeWalk(node, handlers) {
    handlers.enter?.(node);
    if (node.kind === "element" || node.kind === "fragment") {
        for (const child of node.children) {
            jsxNodeWalk(child, handlers);
        }
    }
    handlers.exit?.(node);
}
// --- RENDER ---
const ROOT_TAGS = new Set([
    "html"
]);
const SELF_CLOSING_TAGS = new Set([
    "area",
    "base",
    "br",
    "col",
    "command",
    "embed",
    "hr",
    "img",
    "input",
    "keygen",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr"
]);
const HTML_ENTITIES = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
};
function escapeHTML(str) {
    return str.replace(/[&<>"']/g, (m) => HTML_ENTITIES[m] ?? m);
}
function renderValue(value) {
    if (typeof value === "string") {
        return value;
    }
    else if (typeof value === "number" || typeof value === "boolean") {
        return String(value);
    }
    return JSON.stringify(value);
}
function renderChildren(elements) {
    const texts = [];
    for (const element of elements) {
        texts.push(renderToString(element));
    }
    return texts.join("");
}
function renderAttributes(attrs) {
    const entries = [];
    for (const [key, value] of Object.entries(attrs)) {
        if (value === true) {
            entries.push(` ${key}`);
        }
        else if (typeof value === "string") {
            entries.push(` ${key}="${value}"`);
        }
        else if (typeof value === "number") {
            entries.push(` ${key}="${String(value)}"`);
        }
        else if (typeof value === "object") {
            entries.push(` ${key}="${escapeHTML(JSON.stringify(value))}"`);
        }
    }
    return entries.join("");
}
function renderElement(element) {
    const texts = [];
    if (ROOT_TAGS.has(element.name)) {
        texts.push("<!DOCTYPE html>");
    }
    texts.push("<", element.name, renderAttributes(element.attrs), ">");
    if (!SELF_CLOSING_TAGS.has(element.name)) {
        texts.push(renderChildren(element.children), "</", element.name, ">");
    }
    return texts.join("");
}
export function renderToString(element) {
    switch (element.kind) {
        case "element":
            return renderElement(element);
        case "fragment":
            return renderChildren(element.children);
        case "value":
            return renderValue(element.value);
    }
}
