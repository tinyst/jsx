/** @deprecated this extension will move out from this repository to separated package */
import { fieldPath } from "@tinyst/fieldpath";
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
/** @description using regex to replace alpine syntax on HTML directly */
export function resolveAlpineSyntax(html) {
    return html.replace(/\s(x-on-|x-bind-)([^=]+)=/g, (_, prefix, name) => {
        return ` ${prefix === "x-on-" ? "@" : ":"}${name.replace("_", ".")}=`;
    });
}
