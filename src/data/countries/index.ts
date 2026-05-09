import type { CountryBrief } from "../../types";

import hongKongJson from "./hong-kong.json";
import malaysiaJson from "./malaysia.json";
import singaporeJson from "./singapore.json";
import thailandJson from "./thailand.json";
import vietnamJson from "./vietnam.json";

export const countries = [
  singaporeJson,
  thailandJson,
  malaysiaJson,
  vietnamJson,
  hongKongJson
] as CountryBrief[];

export function getCountryByCode(countryCode: string) {
  return countries.find(
    (country) => country.countryCode.toLowerCase() === countryCode.toLowerCase(),
  );
}
