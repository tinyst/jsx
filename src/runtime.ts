import { createJsxNode, isJsxNode } from "./main.js";
import type { JSX, JsxComponent, JsxElementNode, JsxNode } from "./types.js";

export type * from "./types.js";

function parseChildren(children: any): JsxNode[] {
  const childrenArray = Array.isArray(children) ? children : [children];
  const elements: JSX.Element[] = [];

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
      if (isJsxNode(child)) {
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

function parseAttributes(props?: Record<string, any>): JsxElementNode["attrs"] {
  if (!props) {
    return {};
  }

  const attrs: JsxElementNode["attrs"] = {};

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

function parse(type: JsxComponent<any> | string | undefined, props?: Record<string, any>): JsxNode {
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

export const jsx = (type: JsxComponent<any> | string | undefined, props: Record<string, any>): JSX.Element => {
  return parse(type, props);
}

export const Fragment = (props: Record<string, any>): JSX.Element => {
  return parse(undefined, props);
}

export const jsxs = jsx;
export const jsxDEV = jsx;
