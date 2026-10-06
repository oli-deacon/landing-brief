import type { AirportTransferOption, ArrivalGuide, CountryBrief, HandyPhrase } from "../types";

export const ARRIVAL_CARD_KEY = "landingbrief.arrival-cards.v1";
export const LIBRARY_CHANGE_EVENT = "landingbrief-storage-changed";

export type ArrivalCard = {
  countryCode: string;
  destination: string;
  airport: string;
  reviewedDate: string;
  hotelName: string;
  address: string;
  localAddress: string;
  reminder: string;
  transport: AirportTransferOption | null;
  phrases: HandyPhrase[];
  arrivalGuide?: ArrivalGuide;
  updatedAt: string;
};

function hasStrings(value: unknown, keys: string[]): boolean {
  return !!value && typeof value === "object" && keys.every(key => typeof (value as Record<string, unknown>)[key] === "string");
}

export function getArrivalCards(): Record<string, ArrivalCard> {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(ARRIVAL_CARD_KEY) ?? "{}");
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return Object.fromEntries(Object.entries(parsed).filter(([code, card]) => {
      if (!hasStrings(card, ["countryCode", "destination", "airport", "reviewedDate", "hotelName", "address", "localAddress", "reminder", "updatedAt"])) return false;
      const c = card as ArrivalCard;
      return code === c.countryCode.toLowerCase() && /^[a-z]{2}$/.test(code)
        && (c.transport === null || hasStrings(c.transport, ["mode", "typicalTime", "typicalCost", "bestFor", "notes"]))
        && Array.isArray(c.phrases) && c.phrases.length <= 3
        && c.phrases.every(p => hasStrings(p, ["english", "local", "pronunciation", "context"]))
        && (!c.arrivalGuide || (hasStrings(c.arrivalGuide, ["scope", "reviewedDate"])
          && Array.isArray(c.arrivalGuide.steps) && c.arrivalGuide.steps.every(s => typeof s === "string")
          && hasStrings(c.arrivalGuide.lateArrival, ["serviceWindow", "fallback", "costNote"])
          && Array.isArray(c.arrivalGuide.sources) && c.arrivalGuide.sources.every(s => hasStrings(s, ["url", "label"]))));
    }));
  } catch { return {}; }
}

export function createArrivalCard(brief: CountryBrief): ArrivalCard {
  return {
    countryCode: brief.countryCode.toLowerCase(),
    destination: brief.countryCode.toLowerCase() === "in" ? "Goa, India" : brief.countryName,
    airport: brief.primaryAirport,
    reviewedDate: brief.lastReviewedDate,
    hotelName: "", address: "", localAddress: "", reminder: "",
    transport: null, phrases: [], arrivalGuide: brief.arrivalGuide,
    updatedAt: new Date().toISOString()
  };
}

export function saveArrivalCard(card: ArrivalCard): ArrivalCard {
  const code = card.countryCode.toLowerCase();
  if (!/^[a-z]{2}$/.test(code)) throw new Error("Invalid destination");
  const phrases = Array.from(new Map(card.phrases.map(p => [p.english, p])).values());
  if (phrases.length > 3) throw new Error("Choose up to three phrases");
  const saved = { ...card, countryCode: code, phrases, updatedAt: new Date().toISOString() };
  window.localStorage.setItem(ARRIVAL_CARD_KEY, JSON.stringify({ ...getArrivalCards(), [code]: saved }));
  window.dispatchEvent(new Event(LIBRARY_CHANGE_EVENT));
  return saved;
}

export function clearArrivalCard(countryCode: string) {
  const cards = getArrivalCards();
  delete cards[countryCode.toLowerCase()];
  window.localStorage.setItem(ARRIVAL_CARD_KEY, JSON.stringify(cards));
  window.dispatchEvent(new Event(LIBRARY_CHANGE_EVENT));
}
