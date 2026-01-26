/** @description prevent JSX runtime from doing HTML escape */
export declare function encode(input: string): string;
/** @description convert to "all encoded data" back to Jinja syntax */
export declare function decode<T>(input: T): string;
/** @description helper function to wrap jinja expression for HTML attribute, innerHTML, JSON value, and JSX Prop */
export declare function e<T>(value: T): string;
/** @description helper function to wrap jinja expression inside double quotes for JSON value string */
export declare function q<T>(value: T): string;
/** @description helper function to wrap {% ... %} for define jinja block statement */
export declare function b(value: `if ${string}` | `elif ${string}` | "else" | "endif" | `for ${string} in ${string}` | "endfor"): string;
export type JsonObject = {
    [key: string]: string | number | boolean | JsonObject;
};
/** @description helper function for JSON string (server-side props) inside script tag */
export declare const json: <T extends JsonObject>(props: T) => string;
