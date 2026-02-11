import { JSX_SYMBOL, ROOT_TAGS, SELF_CLOSING_TAGS } from "../constants.js";
import { escapeHTML } from "../helpers.js";
function isIterableOrArray(value) {
    return Array.isArray(value) || (value && typeof value === "object" && typeof value[Symbol.iterator] === "function");
}
function isJsxNode(value) {
    return value && typeof value === "object" && JSX_SYMBOL in value;
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
        let text = "";
        for (const child of children) {
            text += renderChildren(child);
        }
        return text;
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
    let text = "";
    for (const key in props) {
        if (key === "children" || key === "dangerouslySetInnerHTML") {
            // skip children because it's already parsed separately
            continue;
        }
        const value = props[key];
        if (typeof value === "undefined" || value === null || value === false) {
            // skip undefined, null, false values (if you want to show key="false" as attr value, make attr value a string "false")
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
        else {
            throw new Error(`invalid attribute value type: ${typeof value}`);
        }
    }
    return text;
}
function render(type, props) {
    if (typeof type === "function") {
        const children = type(props ?? {});
        return renderChildren(children);
    }
    else if (typeof type === "string") {
        let text = "";
        if (ROOT_TAGS.has(type)) {
            text += "<!DOCTYPE html>";
        }
        text += `<${type}${renderAttrs(props)}>`;
        if (!SELF_CLOSING_TAGS.has(type)) {
            text += renderChildren(props.children ?? props.dangerouslySetInnerHTML?.__html) + `</${type}>`;
        }
        return text;
    }
    else {
        // fragment
        return renderChildren(props.children);
    }
}
export function renderToString(node) {
    return render(node.type, node.props);
}
