export const PREFLIGHT_KEY = "landingbrief.preflight.v1";
export const PREFLIGHT_ITEMS = ["documents", "entry", "data", "address"] as const;
export type PreflightItem = typeof PREFLIGHT_ITEMS[number];
export function readPreflight(country: string): PreflightItem[] {
  try {
    const data = JSON.parse(window.localStorage.getItem(PREFLIGHT_KEY) ?? "{}");
    const items = data?.[country.toLowerCase()];
    return Array.isArray(items) ? PREFLIGHT_ITEMS.filter(item => items.includes(item)) : [];
  } catch { return []; }
}
export function setPreflight(country: string, item: PreflightItem, checked: boolean) {
  if (!/^[a-z]{2}$/i.test(country) || !PREFLIGHT_ITEMS.includes(item)) throw new Error("Invalid checklist item");
  let data: Record<string, unknown> = {};
  try {
    const parsed = JSON.parse(window.localStorage.getItem(PREFLIGHT_KEY) ?? "{}");
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) data = parsed;
  } catch { /* Replace malformed checklist storage on the next successful save. */ }
  const current = readPreflight(country);
  data[country.toLowerCase()] = checked ? [...new Set([...current, item])] : current.filter(value => value !== item);
  window.localStorage.setItem(PREFLIGHT_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event("landingbrief-storage-changed"));
}
