const PREFIX = "J@@@@@@@@@@@@@@@@:";
const SUFFIX = ":################J";
const REGEX = new RegExp(`${PREFIX}(.+?)${SUFFIX}`, "g");

const toHex = (str: string) => {
  return Buffer.from(str, "utf8").toString("hex");
}

const fromHex = (hex: string) => {
  return Buffer.from(hex, "hex").toString("utf8");
}

/** @description prevent JSX runtime from doing HTML escape */
export function encode(input: string) {
  return `${PREFIX}${toHex(input)}${SUFFIX}`;
}

/** @description convert to "all encoded data" back to Jinja syntax */
export function decode<T>(input: T) {
  return String(input).replaceAll(REGEX, (_, capture) => {
    return fromHex(capture);
  });
}

/** @description helper function to wrap jinja expression for HTML attribute, innerHTML, JSON value, and JSX Prop */
export function e<T>(value: T): string {
  return encode(`{{ ${value} }}`);
}

/** @description helper function to wrap jinja expression inside double quotes for JSON value string */
export function q<T>(value: T): string {
  return encode(`"{{ ${value} }}"`);
}

/** @description helper function to wrap {% ... %} for define jinja block statement */
export function b(value: `if ${string}` | `elif ${string}` | "else" | "endif" | `for ${string} in ${string}` | "endfor"): string {
  return encode(`{% ${value} %}`);
}

export type JsonObject = {
  [key: string]: string | number | boolean | JsonObject;
};

/** @description helper function for JSON string (server-side props) inside script tag */
export const json = <T extends JsonObject>(props: T): string => {
  const stringify = (input: JsonObject) => {
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

    return `{${entries.map(([key, value]) => `"${key}":${value}`).join(",")}}`;
  };

  return stringify(props);
};
