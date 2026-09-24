/** Normalize pathname for consistent nav matching */
export function normalizePathname(pathname: string): string {
  const path = pathname.split("?")[0].split("#")[0];
  if (path.length > 1 && path.endsWith("/")) {
    return path.slice(0, -1);
  }
  return path || "/";
}

/**
 * Only one nav item should be active: the longest href that matches the current path.
 * e.g. /admin/overview matches /admin/overview, not /admin (if it existed)
 */
export function isNavItemActive(
  pathname: string,
  href: string,
  allHrefs: string[]
): boolean {
  const current = normalizePathname(pathname);
  const target = normalizePathname(href);

  const matching = allHrefs
    .map(normalizePathname)
    .filter((h) => current === h || current.startsWith(`${h}/`));

  if (matching.length === 0) return false;

  const best = matching.reduce((a, b) => (a.length >= b.length ? a : b));
  return target === best;
}

export function getActiveNavHref(pathname: string, allHrefs: string[]): string | null {
  const current = normalizePathname(pathname);
  const matching = allHrefs
    .map(normalizePathname)
    .filter((h) => current === h || current.startsWith(`${h}/`));

  if (matching.length === 0) return null;
  return matching.reduce((a, b) => (a.length >= b.length ? a : b));
}
