// Positions are fractions of the original 941 × 1672 artwork, before its centred crop.
type AtlasDetails = { lamps: [number, number][] };

export const atlasDetails: Record<string, AtlasDetails> = {
  sg: {
    lamps: [[0.046, 0.612], [0.461, 0.602], [0.631, 0.597], [0.959, 0.609]]
  },
  th: {
    lamps: [[0.056, 0.659], [0.938, 0.659]]
  },
  my: {
    lamps: [[0.05, 0.644], [0.96, 0.638]]
  },
  vn: {
    lamps: [[0.057, 0.639], [0.959, 0.64]]
  },
  hk: {
    lamps: [[0.045, 0.644], [0.365, 0.669], [0.656, 0.633], [0.967, 0.636]]
  },
  mo: {
    lamps: [[0.054, 0.643], [0.354, 0.644], [0.665, 0.645], [0.959, 0.647]]
  },
  kr: {
    lamps: [[0.055, 0.638], [0.957, 0.64]]
  },
  in: {
    lamps: [[0.046, 0.651], [0.961, 0.651]]
  }
};
