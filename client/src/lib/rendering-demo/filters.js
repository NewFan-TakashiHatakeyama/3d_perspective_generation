export const TONE_PRESET_KEYS = ["Neutral", "Day / Cool", "Evening / Warm", "Night / Vibrant"];

export const DEFAULT_TONE_FILTERS = {
  brightness: 1,
  contrast: 1,
  saturate: 1,
  hue: 0,
  sepia: 0,
  blur: 0,
};

export const TONE_PRESETS = {
  Neutral: {},
  "Day / Cool": { brightness: 1.05, contrast: 1.05, saturate: 1.05, hue: -5 },
  "Evening / Warm": { brightness: 1.03, contrast: 1.08, saturate: 1.12, sepia: 0.15, hue: 10 },
  "Night / Vibrant": { brightness: 0.95, contrast: 1.15, saturate: 1.25, hue: 5 },
};

export const FILTER_SLIDERS = [
  { key: "brightness", label: "明るさ", min: 0.5, max: 1.5, step: 0.01 },
  { key: "contrast", label: "コントラスト", min: 0.5, max: 1.5, step: 0.01 },
  { key: "saturate", label: "彩度", min: 0, max: 2, step: 0.01 },
  { key: "hue", label: "色温（Hue）", min: -180, max: 180, step: 1 },
  { key: "sepia", label: "セピア", min: 0, max: 1, step: 0.01 },
  { key: "blur", label: "ぼかし", min: 0, max: 4, step: 0.1 },
];

export const toCssFilter = (filters) =>
  `
    brightness(${filters.brightness})
    contrast(${filters.contrast})
    saturate(${filters.saturate})
    hue-rotate(${filters.hue}deg)
    sepia(${filters.sepia})
    blur(${filters.blur}px)
  `.replace(/\s+/g, " ").trim();

