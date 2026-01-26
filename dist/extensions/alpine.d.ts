import { type FieldPath } from "@tinyst/fieldpath";
import { type JsxNode } from "../main.js";
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
export declare function define<T extends {
    state: {
        [key: string]: any;
    };
    refs?: {
        [key: string]: Element;
    };
    actions?: {
        [key: string]: (this: ComponentInstance<T>, ...args: any[]) => void | Promise<void>;
    };
}>(name: string, setup: () => ComponentSetup<T>): {
    name: string;
    setup: () => ComponentSetup<T>;
};
export declare function infer<T extends {
    state: {
        [key: string]: any;
    };
    refs?: {
        [key: string]: Element;
    };
    actions?: {
        [key: string]: (this: ComponentInstance<T>, ...args: any[]) => void | Promise<void>;
    };
}>(component: ReturnType<typeof define<T>>): {
    name: string;
    state: FieldPath<T["state"]>;
    refs: FieldPath<T["refs"] extends object ? T["refs"] : {}>;
    actions: FieldPath<T["actions"] extends object ? T["actions"] : {}>;
};
export type ClassValues = {
    [key: string]: string | number | boolean | ClassValues;
};
export declare function cn<T extends ClassValues>(props: T): string;
export declare function falsy(value: FieldPath<any>): string;
export declare function resolveSyntax(root: JsxNode): void;
