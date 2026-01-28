import { ROOT_TAGS, SELF_CLOSING_TAGS } from "../constants.js";
import { escapeHTML } from "../helpers.js";
import type { JSX } from "./types.js";

type Write = (chunk: string) => void;

function isIterableOrArray(value: any): value is Iterable<any> {
  return Array.isArray(value) || (value && typeof value === "object" && typeof value[Symbol.iterator] === "function");
}

function renderChildren(write: Write, children: string | number | boolean | object | any[] | undefined | null) {
  if (typeof children === "undefined" || children === null) {
    return;
  }

  else if (typeof children === "string") {
    write(children);
  }

  else if (typeof children === "number" || typeof children === "boolean" || Symbol.toPrimitive in children) {
    write(String(children));
  }

  else if (isIterableOrArray(children)) {
    for (const child of children) {
      renderChildren(write, child);
    }
  }

  else {
    throw new Error(`invalid child type: ${typeof children}`);
  }
}

function renderAttrs(write: Write, props?: Record<string, any>) {
  if (!props) {
    return;
  }

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
      write(` ${key}`);
    }

    else if (typeof value === "string") {
      write(` ${key}="${value}"`);
    }

    else if (typeof value === "number" || Symbol.toPrimitive in value) {
      write(` ${key}="${String(value)}"`);
    }

    else if (typeof value === "object") {
      write(` ${key}="${escapeHTML(JSON.stringify(value))}"`);
    }

    else {
      throw new Error(`invalid attribute value type: ${typeof value}`);
    }
  }
}

function render(write: Write, type: Function | string | undefined, props: Record<string, any>) {
  if (typeof type === "function") {
    const children = type(props ?? {});
    renderChildren(write, children);
  }

  else if (typeof type === "string") {
    if (ROOT_TAGS.has(type)) {
      write("<!DOCTYPE html>");
    }

    write("<");
    write(type);
    renderAttrs(write, props);
    write(">");

    if (SELF_CLOSING_TAGS.has(type)) {
      return;
    }

    renderChildren(write, props.children);
    write("</");
    write(type);
    write(">");
  }

  else {
    // fragment
    renderChildren(write, props.children);
  }
}

export const jsx = (type: Function | string | undefined, props: Record<string, any>): JSX.Element => {
  let text = "";

  const write = (chunk: string) => {
    text += chunk;
  };

  render(write, type, props);
  return text;
}

export const Fragment = (props: Record<string, any>): JSX.Element => {
  let text = "";

  const write = (chunk: string) => {
    text += chunk;
  };

  renderChildren(write, props?.children);
  return text;
}

export const jsxs = jsx;
export const jsxDEV = jsx;
