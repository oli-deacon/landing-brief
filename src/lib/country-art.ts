import imageBkk from "../images/image_bkk.png";
import imageHk from "../images/image_hk.png";
import imageInd from "../images/image_ind.png";
import imageKl from "../images/image_kl.png";
import imageKr from "../images/image_kr.png";
import imageSg from "../images/image_sg.png";
import imageVn from "../images/image_vn.png";

type CountryArtwork = {
  src: string;
  alt: string;
};

const countryArtwork: Record<string, CountryArtwork> = {
  sg: {
    src: imageSg,
    alt: "Singapore travel poster with gold line art of city streets, Marina Bay Sands, and a public bus."
  },
  th: {
    src: imageBkk,
    alt: "Bangkok travel poster with gold line art of street food, tuk-tuks, transit, and temple skyline."
  },
  my: {
    src: imageKl,
    alt: "Kuala Lumpur travel poster with gold line art of the Petronas Towers, transit, and busy street life."
  },
  vn: {
    src: imageVn,
    alt: "Ho Chi Minh City travel poster with gold line art of Ben Thanh Market, scooters, and city streets."
  },
  hk: {
    src: imageHk,
    alt: "Hong Kong travel poster with gold line art of trams, harbour skyline, and dense urban streets."
  },
  kr: {
    src: imageKr,
    alt: "Seoul travel poster with gold line art of buses, street scenes, and the Seoul skyline."
  },
  in: {
    src: imageInd,
    alt: "New Delhi travel poster with gold line art of India Gate, buses, metro signs, and city streets."
  }
};

export function getCountryArtwork(countryCode: string): CountryArtwork | null {
  return countryArtwork[countryCode.trim().toLowerCase()] ?? null;
}
