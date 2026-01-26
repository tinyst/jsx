import { fieldPath, type FieldPath } from "@tinyst/fieldpath";

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
    state: fieldPath<T["state"]>() as T["state"],
    refs: fieldPath<T["refs"] extends object ? T["refs"] : {}>() as T["refs"] extends object ? T["refs"] : {},
    actions: fieldPath<T["actions"] extends object ? T["actions"] : {}>() as T["actions"] extends object ? T["actions"] : {},
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
