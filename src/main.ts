import { JSX_SYMBOL, ROOT_TAGS, SELF_CLOSING_TAGS } from "./constants.js";
import { escapeHTML } from "./helpers.js";
import type { JsxCustomValueNode, JsxCustomValueNodeCreateInput, JsxElementNode, JsxElementNodeCreateInput, JsxFragmentNodeCreateInput, JsxNode, JsxNodeWalkHandler, JsxPrimitiveValueNode, JsxPrimitiveValueNodeCreateInput } from "./types.js";

export type * from "./types.js";

// --- HELPER ---
export function createJsxNode(input: JsxElementNodeCreateInput | JsxFragmentNodeCreateInput | JsxPrimitiveValueNodeCreateInput | JsxCustomValueNodeCreateInput): JsxNode {
  return {
    [JSX_SYMBOL]: true,
    ...input,
  };
}

export function isJsxNode(node: any): node is JsxNode {
  return node && typeof node === "object" && JSX_SYMBOL in node;
}

export function jsxNodeWalk(node: JsxNode, handler: JsxNodeWalkHandler) {
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
function renderCustomValue(value: JsxCustomValueNode["value"]): string {
  if (isJsxNode(value)) {
    return renderToString(value);
  }

  // developer who using this jsx runtime may custom data type but forgot to handle it
  throw new Error(`unsupported value type: ${typeof value}`);
}

function renderPrimitive(value: JsxPrimitiveValueNode["value"]) {
  if (typeof value === "string") {
    return value;
  }

  return String(value);
}

function renderChildren(elements: JsxNode[]) {
  const texts: string[] = [];

  for (const element of elements) {
    texts.push(renderToString(element));
  }

  return texts.join("");
}

function renderAttributes(attrs: JsxElementNode["attrs"]) {
  const entries: string[] = [];

  for (const [key, value] of Object.entries(attrs)) {
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
  }

  return entries.join("");
}

function renderElement(element: JsxElementNode): string {
  const texts: string[] = [];

  if (ROOT_TAGS.has(element.name)) {
    texts.push("<!DOCTYPE html>");
  }

  texts.push("<", element.name, renderAttributes(element.attrs), ">");

  if (!SELF_CLOSING_TAGS.has(element.name)) {
    texts.push(renderChildren(element.children), "</", element.name, ">");
  }

  return texts.join("");
}

export function renderToString(element: JsxNode) {
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
