const PREFIX = "J@@@@@@@@@@@@@@@@:";
const SUFFIX = ":################J";
const REGEX = new RegExp(`${PREFIX}(.+?)${SUFFIX}`, "g");
const toHex = (str) => {
    return Buffer.from(str, "utf8").toString("hex");
};
const fromHex = (hex) => {
    return Buffer.from(hex, "hex").toString("utf8");
};
/** @description prevent JSX runtime from doing HTML escape */
export function encode(input) {
    return `${PREFIX}${toHex(input)}${SUFFIX}`;
}
/** @description convert to "all encoded data" back to Jinja syntax */
export function decode(input) {
    return String(input).replaceAll(REGEX, (_, capture) => {
        return fromHex(capture);
    });
}
/** @description helper function to wrap jinja expression for HTML attribute, innerHTML, JSON value, and JSX Prop */
export function e(value) {
    return encode(`{{ ${value} }}`);
}
/** @description helper function to wrap jinja expression inside double quotes for JSON value string */
export function q(value) {
    return encode(`"{{ ${value} }}"`);
}
/** @description helper function to wrap {% ... %} for define jinja block statement */
export function b(value) {
    return encode(`{% ${value} %}`);
}
/** @description helper function for JSON string (server-side props) inside script tag */
export const json = (props) => {
    const stringify = (input) => {
        const entries = [];
        for (const [key, value] of Object.entries(input)) {
            if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
                entries.push([key, `${value}`]);
            }
            else if (value && typeof value === "object") {
                entries.push([key, stringify(value)]);
            }
        }
        return `{${entries.map(([key, value]) => `"${key}":${value}`).join(",")}}`;
    };
    return stringify(props);
};
