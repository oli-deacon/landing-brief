import type { CountryBrief, CountrySummary } from "../../types";

const COUNTRY_INDEX_URL = "/data/countries/index.json";
const COUNTRY_INDEX_CACHE_KEY = "landingbrief.country-index";
const COUNTRY_BRIEF_CACHE_PREFIX = "landingbrief.country-brief";

type CachedSource = "network" | "cache";

type CountryIndexAsset = CountrySummary & {
  file: string;
};

export type CachedResult<T> = {
  data: T;
  source: CachedSource;
};

function readJsonFromStorage<T>(key: string): T | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(key);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeJsonToStorage<T>(key: string, value: T) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

async function fetchJsonWithCache<T>(url: string, cacheKey: string): Promise<CachedResult<T>> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(response.status === 404 ? "not-found" : "request-failed");
    }

    const data = (await response.json()) as T;
    writeJsonToStorage(cacheKey, data);

    return {
      data,
      source: "network"
    };
  } catch (error) {
    const cached = readJsonFromStorage<T>(cacheKey);

    if (cached) {
      return {
        data: cached,
        source: "cache"
      };
    }

    throw error;
  }
}

export async function getCountries(): Promise<CachedResult<CountrySummary[]>> {
  const result = await fetchJsonWithCache<CountryIndexAsset[]>(COUNTRY_INDEX_URL, COUNTRY_INDEX_CACHE_KEY);

  return {
    data: result.data.map(({ file: _file, ...country }) => country),
    source: result.source
  };
}

export async function getCountryByCode(countryCode: string): Promise<CachedResult<CountryBrief>> {
  const normalizedCode = countryCode.trim().toLowerCase();

  if (!normalizedCode) {
    throw new Error("not-found");
  }

  return fetchJsonWithCache<CountryBrief>(
    `/data/countries/${normalizedCode}.json`,
    `${COUNTRY_BRIEF_CACHE_PREFIX}.${normalizedCode}`,
  );
}
