import type { CountryBrief, CountrySummary } from "../types";
import countryIndex from "../../public/data/countries/index.json";

import { getArrivalCards, LIBRARY_CHANGE_EVENT, type ArrivalCard } from "./arrival-card-storage";

const STORAGE_EVENT = LIBRARY_CHANGE_EVENT;
const SAVED_COUNTRIES_KEY = "landingbrief.saved-countries";
const RECENT_COUNTRIES_KEY = "landingbrief.recent-countries";
const COUNTRY_NOTES_KEY = "landingbrief.country-notes";
const MAX_RECENT_COUNTRIES = 6;

export type SavedCountry = CountrySummary & {
  savedAt: string;
};

export type RecentCountry = CountrySummary & {
  viewedAt: string;
};

export type CountryNoteMap = Record<
  string,
  {
    value: string;
    updatedAt: string;
  }
>;

export type OfflineLibrarySnapshot = {
  savedCountries: SavedCountry[];
  recentCountries: RecentCountry[];
  notes: CountryNoteMap;
  arrivalCards: Record<string, ArrivalCard>;
};

// localStorage is only for low-sensitivity convenience data that is safe to expose on-device.
// Never store tokens, auth material, travel documents, or personal identifiers here.
function readJsonFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  const raw = window.localStorage.getItem(key);

  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function dispatchStorageChange() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent(STORAGE_EVENT));
}

function writeJsonToStorage<T>(key: string, value: T) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
  dispatchStorageChange();
}

export function createCountrySummary(brief: CountryBrief): CountrySummary {
  return {
    countryCode: brief.countryCode,
    countryName: brief.countryName,
    capitalOrMainCity: brief.capitalOrMainCity,
    primaryAirport: brief.primaryAirport,
    lastReviewedDate: brief.lastReviewedDate
  };
}

function refreshCountrySummary<T extends CountrySummary>(country: T): T {
  const current = countryIndex.find((entry) => entry.countryCode === country.countryCode.toLowerCase());
  if (!current) return country;
  const { file: _file, ...summary } = current;
  return { ...country, ...summary };
}

export function getSavedCountries() {
  return readJsonFromStorage<SavedCountry[]>(SAVED_COUNTRIES_KEY, []).map(refreshCountrySummary);
}

export function getRecentCountries() {
  return readJsonFromStorage<RecentCountry[]>(RECENT_COUNTRIES_KEY, []).map(refreshCountrySummary);
}

export function getCountryNotes() {
  return readJsonFromStorage<CountryNoteMap>(COUNTRY_NOTES_KEY, {});
}

export function getCountryNote(countryCode: string) {
  return getCountryNotes()[countryCode.toLowerCase()]?.value ?? "";
}

export function isCountrySaved(countryCode: string) {
  return getSavedCountries().some(
    (country) => country.countryCode.toLowerCase() === countryCode.toLowerCase(),
  );
}

export function toggleSavedCountry(country: CountrySummary) {
  const savedCountries = getSavedCountries();
  const normalizedCode = country.countryCode.toLowerCase();
  const existingCountry = savedCountries.find(
    (entry) => entry.countryCode.toLowerCase() === normalizedCode,
  );

  if (existingCountry) {
    writeJsonToStorage(
      SAVED_COUNTRIES_KEY,
      savedCountries.filter((entry) => entry.countryCode.toLowerCase() !== normalizedCode),
    );

    return false;
  }

  writeJsonToStorage(SAVED_COUNTRIES_KEY, [
    {
      ...country,
      savedAt: new Date().toISOString()
    },
    ...savedCountries
  ]);

  return true;
}

export function recordRecentCountry(country: CountrySummary) {
  const normalizedCode = country.countryCode.toLowerCase();
  const recentCountries = getRecentCountries().filter(
    (entry) => entry.countryCode.toLowerCase() !== normalizedCode,
  );

  writeJsonToStorage(RECENT_COUNTRIES_KEY, [
    {
      ...country,
      viewedAt: new Date().toISOString()
    },
    ...recentCountries
  ].slice(0, MAX_RECENT_COUNTRIES));
}

export function saveCountryNote(countryCode: string, value: string) {
  const normalizedCode = countryCode.toLowerCase();
  const existingNotes = getCountryNotes();
  const nextNotes = { ...existingNotes };

  if (value.trim().length === 0) {
    delete nextNotes[normalizedCode];
  } else {
    nextNotes[normalizedCode] = {
      value,
      updatedAt: new Date().toISOString()
    };
  }

  writeJsonToStorage(COUNTRY_NOTES_KEY, nextNotes);
}

export function getOfflineLibrarySnapshot(): OfflineLibrarySnapshot {
  return {
    savedCountries: getSavedCountries(),
    recentCountries: getRecentCountries(),
    notes: getCountryNotes(),
    arrivalCards: getArrivalCards()
  };
}

export function subscribeToOfflineLibrary(listener: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleChange = () => listener();

  window.addEventListener(STORAGE_EVENT, handleChange);
  window.addEventListener("storage", handleChange);

  return () => {
    window.removeEventListener(STORAGE_EVENT, handleChange);
    window.removeEventListener("storage", handleChange);
  };
}
