const createShot = (id, label, src, tags, meta) => ({
  id,
  label,
  src,
  tags,
  meta,
});

export const RENDER_TAGS = [
  { id: "all", label: "すべて" },
  { id: "overview", label: "全景" },
  { id: "entrance", label: "入口" },
  { id: "island", label: "島" },
  { id: "exit", label: "出口" },
];

export const RENDER_SETS = {
  setA: [
    createShot(
      "01",
      "店舗全景",
      "/renders/setA/01_overview.png",
      ["overview", "day"],
      { angle: "Aerial wide", timeOfDay: "Day", focalLength: 24 }
    ),
    createShot(
      "02",
      "入口",
      "/renders/setA/02_entrance.png",
      ["entrance", "day"],
      { angle: "Entrance eye-level", timeOfDay: "Day", focalLength: 28 }
    ),
    createShot(
      "03",
      "島通路",
      "/renders/setA/03_isle.png",
      ["island", "day"],
      { angle: "Island aisle", timeOfDay: "Day", focalLength: 32 }
    ),
    createShot(
      "04",
      "出口",
      "/renders/setA/04_exit.png",
      ["exit", "day"],
      { angle: "Exit view", timeOfDay: "Day", focalLength: 28 }
    ),
  ],
  setB: [
    createShot(
      "01",
      "店舗全景（セットB）",
      "/renders/setB/01_overview.png",
      ["overview", "evening"],
      { angle: "Aerial wide", timeOfDay: "Evening", focalLength: 24 }
    ),
    createShot(
      "02",
      "入口（夕景）",
      "/renders/setB/02_entrance.png",
      ["entrance", "evening"],
      { angle: "Entrance eye-level", timeOfDay: "Evening", focalLength: 28 }
    ),
    createShot(
      "03",
      "島通路（夕景）",
      "/renders/setB/03_isle.png",
      ["island", "evening"],
      { angle: "Island aisle", timeOfDay: "Evening", focalLength: 32 }
    ),
    createShot(
      "04",
      "出口（夕景）",
      "/renders/setB/04_exit.png",
      ["exit", "evening"],
      { angle: "Exit view", timeOfDay: "Evening", focalLength: 28 }
    ),
  ],
};

export const DEFAULT_RENDER_SET_ID = "setA";

