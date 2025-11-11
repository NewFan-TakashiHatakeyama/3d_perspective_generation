export const LIGHTING_PRESETS = [
  {
    id: "day",
    label: "昼景",
    intensity: 1,
    temperature: 5500,
    castsShadow: true,
  },
  {
    id: "evening",
    label: "夕景",
    intensity: 0.85,
    temperature: 4200,
    castsShadow: true,
  },
  {
    id: "night",
    label: "夜景",
    intensity: 0.65,
    temperature: 3200,
    castsShadow: false,
  },
];

export const DEFAULT_LIGHTING = LIGHTING_PRESETS[0];

