import imageBkk from "../images/image_bkk.png";
import imageHk from "../images/image_hk.png";
import imageInd from "../images/image_ind.png";
import imageKl from "../images/image_kl.png";
import imageMc from "../images/image_mc.png";
import imageKr from "../images/image_kr.png";
import imageSf from "../images/image_sf.png";
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
  },
  sf: {
    kind: "image",
    src: imageSf,
    alt: "San Francisco travel poster artwork featuring the city skyline and arrival mood."
  }
};

export function getCountryArtwork(countryCode: string): CountryArtwork | null {
  return countryArtwork[countryCode.trim().toLowerCase()] ?? null;
}
