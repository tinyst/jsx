import { fieldPath, type FieldPath } from "@tinyst/fieldpath";
import { jsxNodeWalk, type JsxElementNode, type JsxNode } from "../main.js";

// --- CLIENT ---
export type ComponentInstance<T extends {
  state: {
    [key: string]: any;
  };

  refs?: {
    [key: string]: Element;
  };

  actions?: {
    [key: string]: (this: ComponentInstance<T>, ...args: any[]) => void | Promise<void>;
  };
}> = {
  $refs: {
    [key in keyof T["refs"]]: T["refs"][key];
  };

  $watch: <K extends keyof T["state"]>(key: K, callback: (value: T["state"][K]) => void) => void;

  init(): void;
  destroy(): void;
} & {
    [key in keyof T["state"]]: T["state"][key];
  } & {
    [key in keyof T["actions"]]: T["actions"][key];
  };

export type ComponentSetup<T extends {
  state: {
    [key: string]: any;
  };

  refs?: {
    [key: string]: Element;
  };

  actions?: {
    [key: string]: (this: ComponentInstance<T>, ...args: any[]) => void | Promise<void>;
  };
}> = {
  init?(this: ComponentInstance<T>): void;
  destroy?(this: ComponentInstance<T>): void;
} & {
    [key in keyof T["state"]]: T["state"][key];
  } & {
    [key in keyof T["actions"]]: (this: ComponentInstance<T>, ...args: any[]) => void | Promise<void>;
  };

export function define<T extends {
  state: {
    [key: string]: any;
  };

  refs?: {
    [key: string]: Element;
  };

  actions?: {
    [key: string]: (this: ComponentInstance<T>, ...args: any[]) => void | Promise<void>;
  };
}>(name: string, setup: () => ComponentSetup<T>) {
  return {
    name,
    setup,
  };
}

// --- SERVER ---
export function infer<T extends {
  state: {
    [key: string]: any;
  };

  refs?: {
    [key: string]: Element;
  },

  actions?: {
    [key: string]: (this: ComponentInstance<T>, ...args: any[]) => void | Promise<void>;
  };
}>(component: ReturnType<typeof define<T>>) {
  return {
    name: component.name,
    state: fieldPath<T["state"]>(),
    refs: fieldPath<T["refs"] extends object ? T["refs"] : {}>(),
    actions: fieldPath<T["actions"] extends object ? T["actions"] : {}>(),
  };
}

export type ClassValues = {
  [key: string]: string | number | boolean | ClassValues;
};

export function cn<T extends ClassValues>(props: T): string {
  const stringify = (input: ClassValues) => {
    if (Symbol.toPrimitive in input) {
      return String(input);
    }

    const entries: [string, string][] = [];

    for (const [key, value] of Object.entries(input)) {
      if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
        entries.push([key, `${value}`]);
      }

      else if (value && typeof value === "object") {
        entries.push([key, stringify(value)]);
      }
    }

    return `{${entries.map(([key, value]) => `'${key}':${value}`).join(",")}}`;
  };

  return stringify(props);
}

export function falsy(value: FieldPath<any>): string {
  return `!${value}`;
}

export function resolveSyntax(root: JsxNode) {
  jsxNodeWalk(root, {
    enter(node) {
      if (node.kind === "element") {
        const entries = Object.entries(node.attrs);
        const attrs: JsxElementNode["attrs"] = {};

        // we can't write AlpineJS syntax directly on JSX
        for (const [name, value] of entries) {
          if (name.startsWith("x-on-")) {
            attrs[`@${name.slice(5).split("_").join(".")}`] = value;
          }

          else if (name.startsWith("x-bind-")) {
            attrs[`:${name.slice(7)}`] = value;
          }

          else {
            attrs[name] = value;
          }
        }

        node.attrs = attrs;
      }
    }
  });
}
