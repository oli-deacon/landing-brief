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

// Cached JSON is treated as public content for offline viewing only.
// Never place secrets, tokens, or user-specific sensitive records in this storage layer.
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

function ensureArray<T>(value: T[] | undefined | null) {
  return Array.isArray(value) ? value : [];
}

function normalizeCountryBrief(brief: CountryBrief): CountryBrief {
  return {
    ...brief,
    arrivalEssentials: ensureArray(brief.arrivalEssentials),
    airportToCity: {
      airportName: brief.airportToCity?.airportName ?? "",
      options: ensureArray(brief.airportToCity?.options)
    },
    entryRequirements: {
      passportValidity: brief.entryRequirements?.passportValidity ?? "",
      visaSummary: brief.entryRequirements?.visaSummary ?? "",
      arrivalCardOrDeclaration: brief.entryRequirements?.arrivalCardOrDeclaration ?? "",
      officialSourceNote: brief.entryRequirements?.officialSourceNote ?? "",
      officialLinks: ensureArray(brief.entryRequirements?.officialLinks),
      importantNotes: ensureArray(brief.entryRequirements?.importantNotes)
    },
    handyPhrases: ensureArray(brief.handyPhrases),
    businessEtiquette: {
      summary: brief.businessEtiquette?.summary ?? "",
      tips: ensureArray(brief.businessEtiquette?.tips)
    },
    foodAndPracticalities: {
      tapWater: brief.foodAndPracticalities?.tapWater ?? "",
      tipping: brief.foodAndPracticalities?.tipping ?? "",
      dietaryNotes: brief.foodAndPracticalities?.dietaryNotes ?? "",
      commonFoodTips: brief.foodAndPracticalities?.commonFoodTips ?? "",
      usefulPhrases: ensureArray(brief.foodAndPracticalities?.usefulPhrases)
    },
    moneyAndPayments: {
      currency: brief.moneyAndPayments?.currency ?? "",
      conversion: brief.moneyAndPayments?.conversion ?? "",
      cardAcceptance: brief.moneyAndPayments?.cardAcceptance ?? "",
      cashNotes: brief.moneyAndPayments?.cashNotes ?? "",
      tipping: brief.moneyAndPayments?.tipping ?? "",
      roughCostExamples: ensureArray(brief.moneyAndPayments?.roughCostExamples)
    },
    communications: {
      bestMobileNetwork: brief.communications?.bestMobileNetwork ?? "",
      networkWhy: brief.communications?.networkWhy ?? "",
      esimOptions: ensureArray(brief.communications?.esimOptions)
    },
    localTransportApps: ensureArray(brief.localTransportApps),
    emergencyNumbers: {
      label: brief.emergencyNumbers?.label ?? "Emergency",
      number: brief.emergencyNumbers?.number ?? "",
      notes: ensureArray(brief.emergencyNumbers?.notes)
    }
  };
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

  const result = await fetchJsonWithCache<CountryBrief>(
    `/data/countries/${normalizedCode}.json`,
    `${COUNTRY_BRIEF_CACHE_PREFIX}.${normalizedCode}`,
  );

  return {
    data: normalizeCountryBrief(result.data),
    source: result.source
  };
}
