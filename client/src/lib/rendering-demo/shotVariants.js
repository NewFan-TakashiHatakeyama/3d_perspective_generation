const variantPath = (filePath) => filePath;

const SHOT_VARIANT_SOURCES = {
  setA: {
    "02": {
      default: variantPath("/renders/setA/02_entrance.png"),
      floor_none: {
        default: variantPath("/renders/setA/02_entrance.png"),
        wall_white: variantPath("/renders/setA/02_entrance_default_white.png"),
        wall_metal: variantPath("/renders/setA/02_entrance_default_metal.png"),
        wall_wood: variantPath("/renders/setA/02_entrance_default_mokume.png"),
      },
      floor_stone: {
        default: variantPath("/renders/setA/02_entrance_iwame_default.png"),
        wall_white: variantPath("/renders/setA/02_entrance_iwame_white.png"),
        wall_metal: variantPath("/renders/setA/02_entrance_iwame_metal.png"),
        wall_wood: variantPath("/renders/setA/02_entrance_iwame_mokume.png"),
      },
      floor_wood: {
        default: variantPath("/renders/setA/02_entrance_mokume_default.png"),
        wall_white: variantPath("/renders/setA/02_entrance_mokume_white.png"),
        wall_metal: variantPath("/renders/setA/02_entrance_mokume_metal.png"),
        wall_wood: variantPath("/renders/setA/02_entrance_mokume_mokume.png"),
      },
      floor_carpet: {
        default: variantPath("/renders/setA/02_entrance_carpet_default.png"),
        wall_white: variantPath("/renders/setA/02_entrance_carpet_white.png"),
        wall_metal: variantPath("/renders/setA/02_entrance_carpet_metal.png"),
        wall_wood: variantPath("/renders/setA/02_entrance_carpet_mokume.png"),
      },
    },
    "03": {
      default: variantPath("/renders/setA/03_isle.png"),
      floor_none: {
        default: variantPath("/renders/setA/03_isle.png"),
        wall_white: variantPath("/renders/setA/03_isle_default_white.png"),
        wall_metal: variantPath("/renders/setA/03_isle_default_metal.png"),
        wall_wood: variantPath("/renders/setA/03_isle_default_mokume.png"),
      },
      floor_stone: {
        default: variantPath("/renders/setA/03_isle_iwame_default.png"),
        wall_white: variantPath("/renders/setA/03_isle_iwame_white.png"),
        wall_metal: variantPath("/renders/setA/03_isle_iwame_metal.png"),
        wall_wood: variantPath("/renders/setA/03_isle_iwame_mokume.png"),
      },
      floor_wood: {
        default: variantPath("/renders/setA/03_isle_mokume_default.png"),
        wall_white: variantPath("/renders/setA/03_isle_mokume_white.png"),
        wall_metal: variantPath("/renders/setA/03_isle_mokume_metal.png"),
        wall_wood: variantPath("/renders/setA/03_isle_mokume_mokume.png"),
      },
      floor_carpet: {
        default: variantPath("/renders/setA/03_isle_carpet_default.png"),
        wall_white: variantPath("/renders/setA/03_isle_carpet_white.png"),
        wall_metal: variantPath("/renders/setA/03_isle_carpet_metal.png"),
        wall_wood: variantPath("/renders/setA/03_isle_carpet_mokume.png"),
      },
    },
  },
};

const isNoneVariant = (variantId, prefix) =>
  !variantId || variantId === `${prefix}_none`;

export const resolveShotVariantSrc = (setId, shot, materialVariants) => {
  const variantConfig = SHOT_VARIANT_SOURCES[setId]?.[shot.id];
  if (!variantConfig) {
    return shot.src;
  }

  const floorVariant =
    materialVariants.floor && !isNoneVariant(materialVariants.floor, "floor")
      ? materialVariants.floor
      : "floor_none";
  const wallVariant =
    materialVariants.wall && !isNoneVariant(materialVariants.wall, "wall")
      ? materialVariants.wall
      : "wall_none";

  const resolveForFloor = (floorKey) => {
    const floorConfig = variantConfig[floorKey];
    if (!floorConfig) return null;
    if (typeof floorConfig === "string") return floorConfig;
    if (wallVariant && wallVariant !== "wall_none") {
      const wallMatch = floorConfig[wallVariant];
      if (wallMatch) return wallMatch;
    }
    return floorConfig.default ?? null;
  };

  return (
    resolveForFloor(floorVariant) ??
    (wallVariant !== "wall_none" ? resolveForFloor("floor_none") : null) ??
    variantConfig.default ??
    shot.src
  );
};

export const getShotWithVariants = (setId, shot, materialVariants) => ({
  ...shot,
  src: resolveShotVariantSrc(setId, shot, materialVariants),
});

export default SHOT_VARIANT_SOURCES;

