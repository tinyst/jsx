import { createJsxNode, isJsxNode } from "./main.js";
import type { JSX, JsxComponent, JsxElementNode, JsxNode } from "./types.js";

export type * from "./types.js";

function isIterableOrArray(value: any): value is Iterable<any> {
  return Array.isArray(value) || (value && typeof value === "object" && typeof value[Symbol.iterator] === "function");
}

function parseChildren(children: any): JsxNode[] {
  const iterable = isIterableOrArray(children) ? children : [children];
  const elements: JSX.Element[] = [];

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

function parseAttributes(props?: Record<string, any>): JsxElementNode["attrs"] {
  if (!props) {
    return {};
  }

  const attrs: JsxElementNode["attrs"] = {};

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

function parse(type: JsxComponent<any> | string | undefined, props?: Record<string, any>): JsxNode {
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

export const jsx = (type: JsxComponent<any> | string | undefined, props: Record<string, any>): JSX.Element => {
  return parse(type, props);
}

export const Fragment = (props: Record<string, any>): JSX.Element => {
  return parse(undefined, props);
}

export const jsxs = jsx;
export const jsxDEV = jsx;
