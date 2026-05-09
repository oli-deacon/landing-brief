export type EntryRequirements = {
  passportValidity: string;
  visaSummary: string;
  arrivalCardOrDeclaration: string;
  officialSourceNote: string;
  importantNotes: string[];
};

export type EmergencyNumbers = {
  label: string;
  number: string;
  notes: string[];
};

export type AirportTransferOption = {
  mode: string;
  typicalTime: string;
  typicalCost: string;
  bestFor: string;
  notes: string;
};

export type AirportToCity = {
  airportName: string;
  options: AirportTransferOption[];
};

export type HandyPhrase = {
  english: string;
  local: string;
  pronunciation: string;
  context: string;
};

export type BusinessEtiquette = {
  summary: string;
  tips: string[];
};

export type FoodAndPracticalities = {
  tapWater: string;
  tipping: string;
  dietaryNotes: string;
  commonFoodTips: string;
  usefulPhrases: string[];
};

export type MoneyAndPayments = {
  currency: string;
  conversion: string;
  cardAcceptance: string;
  cashNotes: string;
  tipping: string;
  roughCostExamples: string[];
};

export type TransportApp = {
  name: string;
  useCase: string;
  notes: string;
};

export type CountryBrief = {
  countryCode: string;
  countryName: string;
  capitalOrMainCity: string;
  primaryAirport: string;
  arrivalEssentials: string[];
  airportToCity: AirportToCity;
  entryRequirements: EntryRequirements;
  handyPhrases: HandyPhrase[];
  businessEtiquette: BusinessEtiquette;
  foodAndPracticalities: FoodAndPracticalities;
  moneyAndPayments: MoneyAndPayments;
  localTransportApps: TransportApp[];
  emergencyNumbers: EmergencyNumbers;
  lastReviewedDate: string;
  disclaimer: string;
};

export type CountrySummary = Pick<
  CountryBrief,
  "countryCode" | "countryName" | "capitalOrMainCity" | "primaryAirport" | "lastReviewedDate"
>;
