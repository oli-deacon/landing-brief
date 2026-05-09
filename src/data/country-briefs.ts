import countryBriefsJson from "./country-briefs.json";
import type { CountryBrief } from "../types";

export const countryBriefs = countryBriefsJson as CountryBrief[];

export function getCountryBrief(countryCode: string) {
  return countryBriefs.find(
    (brief) => brief.countryCode.toLowerCase() === countryCode.toLowerCase(),
  );
}
