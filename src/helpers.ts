import { HTML_ENTITIES } from "./constants.js";

export function escapeHTML(str: string): string {
  return str.replace(/[&<>"']/g, (m) => HTML_ENTITIES[m] ?? m);
}
