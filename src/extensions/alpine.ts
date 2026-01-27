/** @deprecated this extension will move out from this repository to separated package */

import { fieldPath } from "@tinyst/fieldpath";

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

/** @description using regex to replace alpine syntax on HTML directly */
export function resolveAlpineSyntax(html: string): string {
  return html.replace(/\s(x-on-|x-bind-)([^=]+)=/g, (_, prefix, name) => {
    return ` ${prefix === "x-on-" ? "@" : ":"}${name.replace("_", ".")}=`;
  });
}
