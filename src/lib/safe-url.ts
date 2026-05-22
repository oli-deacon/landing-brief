export function getSafeExternalUrl(value: string) {
  try {
    const url = new URL(value);

    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}
