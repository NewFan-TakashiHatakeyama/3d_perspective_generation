export const CAMERA_PRESETS = [
  {
    id: "overview",
    label: "全景俯瞰",
    fov: 28,
    exposure: 0,
    description: "俯瞰の広角ショット。全体の雰囲気を掴む。",
  },
  {
    id: "entrance",
    label: "入口広角",
    fov: 35,
    exposure: 0.2,
    description: "入口付近の広がり感を強調。",
  },
  {
    id: "island",
    label: "島通路",
    fov: 40,
    exposure: -0.1,
    description: "島と導線の様子を捉える。",
  },
  {
    id: "machine",
    label: "台クローズアップ",
    fov: 60,
    exposure: 0.4,
    description: "筐体のディテールを強調。",
  },
];

export const DEFAULT_CAMERA = CAMERA_PRESETS[0];

