import { JSX_SYMBOL } from "./constants.js";
import type { JSX, JsxElement, JsxElementCreateInput, JsxFragmentCreateInput, JsxValue, JsxValueCreateInput, JsxWalkHandlers } from "./types.js";

export type * from "./types.js";

// --- HELPER ---
export function createJsxElement(input: JsxElementCreateInput | JsxFragmentCreateInput | JsxValueCreateInput): JSX.Element {
  return {
    [JSX_SYMBOL]: true,
    ...input,
  };
}

export function isJsxElement(el: any): el is JSX.Element {
  return el && typeof el === "object" && JSX_SYMBOL in el;
}

export function walkJsxElement(element: JSX.Element, handlers: JsxWalkHandlers) {
  handlers.enter?.(element);

  if (element.kind === "element" || element.kind === "fragment") {
    for (const child of element.children) {
      walkJsxElement(child, handlers);
    }
  }

  handlers.exit?.(element);
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

const HTML_ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
};

function escapeHTML(str: string): string {
  return str.replace(/[&<>"']/g, (m) => HTML_ENTITIES[m] ?? m);
}

function renderValue(value: JsxValue["value"]) {
  if (typeof value === "string") {
    return value;
  }

  else if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return JSON.stringify(value);
}

function renderChildren(elements: JSX.Element[]) {
  const texts: string[] = [];

  for (const element of elements) {
    texts.push(renderToString(element));
  }

  return texts.join("");
}

function renderAttributes(attrs: JsxElement["attrs"]) {
  const entries: string[] = [];

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

function renderElement(element: JsxElement): string {
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

export function renderToString(element: JSX.Element) {
  switch (element.kind) {
    case "element":
      return renderElement(element);
    case "fragment":
      return renderChildren(element.children);
    case "value":
      return renderValue(element.value);
  }
}
