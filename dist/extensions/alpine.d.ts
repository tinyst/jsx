/** @deprecated this extension will move out from this repository to separated package */
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
    state: import("@tinyst/fieldpath").FieldPath<T["state"]>;
    refs: import("@tinyst/fieldpath").FieldPath<T["refs"] extends object ? T["refs"] : {}>;
    actions: import("@tinyst/fieldpath").FieldPath<T["actions"] extends object ? T["actions"] : {}>;
};
/** @description using regex to replace alpine syntax on HTML directly */
export declare function resolveAlpineSyntax(html: string): string;
