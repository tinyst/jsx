import { fieldPath } from "@tinyst/fieldpath";
export function define(name, setup) {
    return {
        name,
        setup,
    };
}
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
