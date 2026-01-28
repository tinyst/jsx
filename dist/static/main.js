import { ROOT_TAGS, SELF_CLOSING_TAGS } from "../constants.js";
import { escapeHTML } from "../helpers.js";
function isIterableOrArray(value) {
    return Array.isArray(value) || (value && typeof value === "object" && typeof value[Symbol.iterator] === "function");
}
function isJsxNode(value) {
    return value && typeof value === "object" && "type" in value && "props" in value;
}
function renderChildren(children) {
    if (typeof children === "undefined" || children === null) {
        return "";
    }
    else if (typeof children === "string") {
        return children;
    }
    else if (typeof children === "number" || typeof children === "boolean" || Symbol.toPrimitive in children) {
        return String(children);
    }
    else if (isIterableOrArray(children)) {
        const entries = [];
        for (const child of children) {
            entries.push(renderChildren(child));
        }
        return entries.join("");
    }
    else if (typeof children === "object") {
        if (isJsxNode(children)) {
            return render(children.type, children.props);
        }
        return JSON.stringify(children);
    }
    else {
        throw new Error(`invalid child type: ${typeof children}`);
    }
}
function renderAttrs(props) {
    if (!props) {
        return "";
    }
    const entries = [];
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
            entries.push(` ${key}`);
        }
        else if (typeof value === "string") {
            entries.push(` ${key}="${value}"`);
        }
        else if (typeof value === "number" || Symbol.toPrimitive in value) {
            entries.push(` ${key}="${String(value)}"`);
        }
        else if (typeof value === "object") {
            entries.push(` ${key}="${escapeHTML(JSON.stringify(value))}"`);
        }
        else {
            throw new Error(`invalid attribute value type: ${typeof value}`);
        }
    }
    return entries.join("");
}
function render(type, props) {
    if (typeof type === "function") {
        const children = type(props ?? {});
        return renderChildren(children);
    }
    else if (typeof type === "string") {
        const entries = [];
        if (ROOT_TAGS.has(type)) {
            entries.push("<!DOCTYPE html>");
        }
        entries.push(`<${type}${renderAttrs(props)}>`);
        if (!SELF_CLOSING_TAGS.has(type)) {
            entries.push(renderChildren(props.children), `</${type}>`);
        }
        return entries.join("");
    }
    else {
        // fragment
        return renderChildren(props.children);
    }
}
export function renderToString(node) {
    return render(node.type, node.props);
}
