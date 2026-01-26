import { fieldPath } from "@tinyst/fieldpath";
import { jsxNodeWalk } from "../main.js";
export function define(name, setup) {
    return {
        name,
        setup,
    };
}
// --- SERVER ---
export function infer(component) {
    return {
        name: component.name,
        state: fieldPath(),
        refs: fieldPath(),
        actions: fieldPath(),
    };
}
export function cn(props) {
    const stringify = (input) => {
        if (Symbol.toPrimitive in input) {
            return String(input);
        }
        const entries = [];
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
export function falsy(value) {
    return `!${value}`;
}
export function resolveSyntax(root) {
    jsxNodeWalk(root, {
        enter(node) {
            if (node.kind === "element") {
                const entries = Object.entries(node.attrs);
                const attrs = {};
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
