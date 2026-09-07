import atlasBkk from "../images/Bangkok_Diorama.png";
import atlasHk from "../images/HongKong_Diorama.png";
import atlasInd from "../images/NewDelhi_Diorama.png";
import atlasKl from "../images/KualaLumpur_Diorama.png";
import atlasMc from "../images/Macau_Diorama.png";
import atlasKr from "../images/Seoul_Diorama.png";
import atlasSg from "../images/Singapore_Diorama.png";
import atlasVn from "../images/Vietnam_Diorama.png";
import imageBkk from "../images/image_bkk.png";
import imageHk from "../images/image_hk.png";
import imageInd from "../images/image_ind.png";
import imageKl from "../images/image_kl.png";
import imageMc from "../images/image_mc.png";
import imageKr from "../images/image_kr.png";
import imageSg from "../images/image_sg.png";
import imageVn from "../images/image_vn.png";

type ImageArtwork = {
  kind: "image";
  src: string;
  alt: string;
};

type PlaceholderArtwork = {
  kind: "placeholder";
  label: string;
  title: string;
  description: string;
};

export type CountryArtwork = ImageArtwork | PlaceholderArtwork;

const countryArtwork: Record<string, CountryArtwork> = {
  sg: {
    kind: "image",
    src: imageSg,
    alt: "Singapore travel poster with gold line art of city streets, Marina Bay Sands, and a public bus."
  },
  th: {
    kind: "image",
    src: imageBkk,
    alt: "Bangkok travel poster with gold line art of street food, tuk-tuks, transit, and temple skyline."
  },
  my: {
    kind: "image",
    src: imageKl,
    alt: "Kuala Lumpur travel poster with gold line art of the Petronas Towers, transit, and busy street life."
  },
  vn: {
    kind: "image",
    src: imageVn,
    alt: "Ho Chi Minh City travel poster with gold line art of Ben Thanh Market, scooters, and city streets."
  },
  hk: {
    kind: "image",
    src: imageHk,
    alt: "Hong Kong travel poster with gold line art of trams, harbour skyline, and dense urban streets."
  },
  mo: {
    kind: "image",
    src: imageMc,
    alt: "Macau travel poster with gold line art of the Ruins of Saint Paul's, Senado-style streets, and the Grand Lisboa skyline."
  },
  kr: {
    kind: "image",
    src: imageKr,
    alt: "Seoul travel poster with gold line art of buses, street scenes, and the Seoul skyline."
  },
  in: {
    kind: "image",
    src: imageInd,
    alt: "New Delhi travel poster with gold line art of India Gate, buses, metro signs, and city streets."
  }
};

const atlasArtwork: Record<string, CountryArtwork> = {
  sg: {
    kind: "image",
    src: atlasSg,
    alt: "Singapore diorama with Marina Bay Sands, the Merlion, Gardens by the Bay, public transit, and waterfront landmarks."
  },
  th: {
    kind: "image",
    src: atlasBkk,
    alt: "Bangkok diorama with temples, tuk-tuks, river boats, transit, and a city skyline."
  },
  my: {
    kind: "image",
    src: atlasKl,
    alt: "Kuala Lumpur diorama with the Petronas Towers, transit, historic buildings, and street food."
  },
  vn: {
    kind: "image",
    src: atlasVn,
    alt: "Ho Chi Minh City diorama with Ben Thanh Market, scooters, landmarks, and the city skyline."
  },
  hk: {
    kind: "image",
    src: atlasHk,
    alt: "Hong Kong diorama with trams, harbour ferries, the skyline, and landmark buildings."
  },
  mo: {
    kind: "image",
    src: atlasMc,
    alt: "Macau diorama with the Ruins of Saint Paul's, the Macau skyline, and a waterfront ferry."
  },
  kr: {
    kind: "image",
    src: atlasKr,
    alt: "Seoul diorama with traditional gates, palaces, buses, N Seoul Tower, and the modern skyline."
  },
  in: {
    kind: "image",
    src: atlasInd,
    alt: "New Delhi diorama with India Gate, Qutub Minar, the Lotus Temple, buses, and an auto-rickshaw."
  }
};

export function getCountryArtwork(countryCode: string): CountryArtwork | null {
  return countryArtwork[countryCode.trim().toLowerCase()] ?? null;
}

export function getAtlasCountryArtwork(countryCode: string): CountryArtwork | null {
  const normalizedCode = countryCode.trim().toLowerCase();

  return atlasArtwork[normalizedCode] ?? countryArtwork[normalizedCode] ?? null;
}
