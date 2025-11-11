export const MATERIAL_VARIANT_GROUPS = [
  {
    id: "floor",
    label: "床",
    variants: [
      { id: "floor_none", label: "選択なし", previewColor: "#2d3748" },
      { id: "floor_stone", label: "石目", previewColor: "#b6b8be" },
      { id: "floor_wood", label: "木目", previewColor: "#9b6a3a" },
      { id: "floor_carpet", label: "カーペット", previewColor: "#d04e59" },
    ],
  },
  {
    id: "wall",
    label: "壁",
    variants: [
      { id: "wall_none", label: "選択なし", previewColor: "#2d3748" },
      { id: "wall_white", label: "ホワイト", previewColor: "#f5f5f5" },
      { id: "wall_wood", label: "木調", previewColor: "#c79b6d" },
      { id: "wall_metal", label: "メタル", previewColor: "#6f7b86" },
    ],
  },
  {
    id: "fixture",
    label: "什器",
    variants: [
      { id: "fixture_none", label: "選択なし", previewColor: "#2d3748" },
      { id: "fixture_black", label: "ブラック", previewColor: "#1d1d1d" },
      { id: "fixture_silver", label: "シルバー", previewColor: "#8e99a3" },
      { id: "fixture_red", label: "レッドアクセント", previewColor: "#b9273d" },
    ],
  },
];

export const DEFAULT_MATERIAL_VARIANTS = MATERIAL_VARIANT_GROUPS.reduce(
  (acc, group) => ({
    ...acc,
    [group.id]: group.variants[0].id,
  }),
  {}
);

