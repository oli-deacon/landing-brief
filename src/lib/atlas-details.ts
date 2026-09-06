// Positions are fractions of the original 941 × 1672 artwork, before its centred crop.
export type AtlasLandmark = { name: string; x: number; y: number };
type AtlasDetails = { landmarks: AtlasLandmark[]; lamps: [number, number][] };

export const atlasDetails: Record<string, AtlasDetails> = {
  sg: {
    landmarks: [
      { name: "Marina Bay Sands", x: 0.32, y: 0.49 },
      { name: "The Merlion", x: 0.54, y: 0.58 },
      { name: "Singapore Flyer", x: 0.86, y: 0.49 }
    ],
    lamps: [[0.046, 0.612], [0.461, 0.602], [0.631, 0.597], [0.959, 0.609]]
  },
  th: {
    landmarks: [
      { name: "Wat Arun", x: 0.40, y: 0.50 },
      { name: "The Giant Swing", x: 0.155, y: 0.555 },
      { name: "Long-tail boat", x: 0.72, y: 0.755 }
    ],
    lamps: [[0.056, 0.659], [0.938, 0.659]]
  },
  my: {
    landmarks: [
      { name: "Petronas Twin Towers", x: 0.495, y: 0.46 },
      { name: "KL Tower", x: 0.218, y: 0.425 },
      { name: "Sultan Abdul Samad Building", x: 0.747, y: 0.591 }
    ],
    lamps: [[0.05, 0.644], [0.96, 0.638]]
  },
  vn: {
    landmarks: [
      { name: "Bitexco Financial Tower", x: 0.383, y: 0.475 },
      { name: "Notre-Dame Cathedral", x: 0.20, y: 0.58 },
      { name: "Ben Thanh Market", x: 0.76, y: 0.622 }
    ],
    lamps: [[0.057, 0.639], [0.959, 0.64]]
  },
  hk: {
    landmarks: [
      { name: "Tian Tan Buddha", x: 0.284, y: 0.51 },
      { name: "Bank of China Tower", x: 0.50, y: 0.53 },
      { name: "Star Ferry", x: 0.846, y: 0.738 }
    ],
    lamps: [[0.045, 0.644], [0.365, 0.669], [0.656, 0.633], [0.967, 0.636]]
  },
  mo: {
    landmarks: [
      { name: "Macau Tower", x: 0.174, y: 0.443 },
      { name: "Ruins of Saint Paul’s", x: 0.50, y: 0.609 },
      { name: "Grand Lisboa", x: 0.686, y: 0.49 }
    ],
    lamps: [[0.054, 0.643], [0.354, 0.644], [0.665, 0.645], [0.959, 0.647]]
  },
  kr: {
    landmarks: [
      { name: "N Seoul Tower", x: 0.159, y: 0.457 },
      { name: "Gwanghwamun Gate", x: 0.515, y: 0.633 },
      { name: "Lotte World Tower", x: 0.747, y: 0.504 }
    ],
    lamps: [[0.055, 0.638], [0.957, 0.64]]
  },
  in: {
    landmarks: [
      { name: "India Gate", x: 0.174, y: 0.559 },
      { name: "Qutub Minar", x: 0.337, y: 0.46 },
      { name: "Lotus Temple", x: 0.449, y: 0.611 }
    ],
    lamps: [[0.046, 0.651], [0.961, 0.651]]
  }
};
