/**
 * Base-path helper for static hosting under a sub-folder (e.g. GitHub Pages serves the site at
 * https://<user>.github.io/<repo>/). Next.js prefixes <Link> and route URLs automatically, but not
 * plain <img src> / <video src> / window.location — those go through `withBase`.
 *
 * NEXT_PUBLIC_BASE_PATH is inlined at build time; it is empty for the dev server and for hosts
 * that serve from the domain root.
 */
export const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");

export function withBase(path: string): string {
  if (!BASE_PATH || !path) return path;
  if (!path.startsWith("/") || path.startsWith("//")) return path; // external or protocol-relative
  if (path === BASE_PATH || path.startsWith(`${BASE_PATH}/`)) return path; // already prefixed
  return `${BASE_PATH}${path}`;
}
