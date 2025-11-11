import { create } from "zustand";
import {
  DEFAULT_CAMERA,
  DEFAULT_LIGHTING,
  DEFAULT_MATERIAL_VARIANTS,
  DEFAULT_RENDER_SET_ID,
  DEFAULT_TONE_FILTERS,
  getShotWithVariants,
  RENDER_SETS,
} from "../lib/rendering-demo";

const cloneToneFilters = () => ({ ...DEFAULT_TONE_FILTERS });
const cloneMaterialVariants = () => ({ ...DEFAULT_MATERIAL_VARIANTS });

export const COMPARISON_MODES = ["single", "split", "slider"];

const getFirstShotId = (setId) => {
  const shots = RENDER_SETS[setId] ?? [];
  return shots.length > 0 ? shots[0].id : null;
};

const initialProjectBrief = {
  drawings: { exteriorCount: "3", interiorCount: "5" },
  materials: {
    finishSheetUrl: "https://example.com/spec/finishes",
  },
  lighting: { colorTemperature: "4000" },
  direction: {
    moodboardUrl: "https://www.pinterest.com/",
    targetAudience: "30代ファミリー層 / 地域密着型ブランド",
  },
  delivery: {
    imageCount: "3",
    format: "png",
    timeOfDay: "day",
    resolution: "4k",
  },
};

const cloneProjectBrief = () => ({
  drawings: { ...initialProjectBrief.drawings },
  materials: { ...initialProjectBrief.materials },
  lighting: { ...initialProjectBrief.lighting },
  direction: { ...initialProjectBrief.direction },
  delivery: { ...initialProjectBrief.delivery },
});

const initialSetId = DEFAULT_RENDER_SET_ID;
const initialShotId = getFirstShotId(initialSetId);

const buildInitialMaterialState = () => {
  if (!initialShotId) return {};
  return {
    [initialSetId]: {
      [initialShotId]: cloneMaterialVariants(),
    },
  };
};

const useRenderingDemoStore = create((set, get) => ({
  activeSetId: initialSetId,
  activeTag: "all",
  selectedRenderId: initialShotId,
  selectedRenderIds: initialShotId ? { [initialShotId]: true } : {},
  altTextByShot: {},
  toneFilters: cloneToneFilters(),
  activeTonePreset: "Neutral",
  materialVariantsByShot: buildInitialMaterialState(),
  lighting: { ...DEFAULT_LIGHTING },
  camera: { ...DEFAULT_CAMERA },
  comparisonMode: "single",
  comparisonSliderPosition: 50,
  uploadedFloorPlan: null,
  uploadedFloorPlanName: "",
  projectBrief: cloneProjectBrief(),

  setActiveSetId: (setId) =>
    set((state) => {
      const firstShot = getFirstShotId(setId);
      return {
        activeSetId: setId,
        selectedRenderId: firstShot,
        selectedRenderIds: firstShot ? { [firstShot]: true } : {},
      };
    }),

  setActiveTag: (tagId) => set({ activeTag: tagId }),

  setUploadedFloorPlan: (fileUrl, fileName = "") =>
    set({ uploadedFloorPlan: fileUrl, uploadedFloorPlanName: fileName }),

  setSelectedRenderId: (renderId) =>
    set((state) => ({
      selectedRenderId: renderId,
      selectedRenderIds: { ...state.selectedRenderIds, [renderId]: true },
    })),

  toggleBulkSelection: (renderId) =>
    set((state) => {
      const next = { ...state.selectedRenderIds };
      if (next[renderId]) {
        delete next[renderId];
      } else {
        next[renderId] = true;
      }
      return { selectedRenderIds: next };
    }),

  resetBulkSelection: () =>
    set((state) =>
      state.selectedRenderId
        ? { selectedRenderIds: { [state.selectedRenderId]: true } }
        : { selectedRenderIds: {} }
    ),
  setAltText: (shotId, value) =>
    set((state) => ({
      altTextByShot: { ...state.altTextByShot, [shotId]: value },
    })),

  applyTonePreset: (presetKey, presetFilters) =>
    set({
      toneFilters: { ...cloneToneFilters(), ...presetFilters },
      activeTonePreset: presetKey,
    }),

  setToneFilterValue: (key, value) =>
    set((state) => ({
      toneFilters: { ...state.toneFilters, [key]: value },
      activeTonePreset: "Custom",
    })),

  resetToneFilters: () =>
    set({
      toneFilters: cloneToneFilters(),
      activeTonePreset: "Neutral",
    }),

  setMaterialVariant: (setId, shotId, groupId, variantId) =>
    set((state) => {
      if (!setId || !shotId) {
        return {};
      }
      const nextBySet = { ...state.materialVariantsByShot };
      const setVariants = { ...(nextBySet[setId] ?? {}) };
      const shotVariants = {
        ...(setVariants[shotId] ?? cloneMaterialVariants()),
        [groupId]: variantId,
      };
      setVariants[shotId] = shotVariants;
      nextBySet[setId] = setVariants;
      return { materialVariantsByShot: nextBySet };
    }),

  setLighting: (partial) =>
    set((state) => ({
      lighting: { ...state.lighting, ...partial },
    })),

  setLightingPreset: (preset) => set({ lighting: { ...preset } }),

  setCamera: (partial) =>
    set((state) => ({
      camera: { ...state.camera, ...partial },
    })),

  setCameraPreset: (preset) => set({ camera: { ...preset } }),

  setComparisonMode: (mode) =>
    set({
      comparisonMode: COMPARISON_MODES.includes(mode) ? mode : "single",
    }),

  setComparisonSliderPosition: (value) =>
    set({
      comparisonSliderPosition: Math.min(100, Math.max(0, value)),
    }),

  setProjectBriefField: (section, field, value) =>
    set((state) => ({
      projectBrief: {
        ...state.projectBrief,
        [section]: {
          ...state.projectBrief[section],
          [field]: value,
        },
      },
    })),

  getActiveShots: () => {
    const state = get();
    const shots = RENDER_SETS[state.activeSetId] ?? [];
    const filtered =
      state.activeTag === "all"
        ? shots
        : shots.filter((shot) => shot.tags?.includes(state.activeTag));
    return filtered.map((shot) => {
      const variantsForShot =
        state.materialVariantsByShot[state.activeSetId]?.[shot.id] ??
        DEFAULT_MATERIAL_VARIANTS;
      return getShotWithVariants(state.activeSetId, shot, variantsForShot);
    });
  },

  getSelectedShots: () => {
    const state = get();
    const shots = RENDER_SETS[state.activeSetId] ?? [];
    const selectedIds = Object.keys(state.selectedRenderIds);
    return shots
      .filter((shot) => selectedIds.includes(shot.id))
      .map((shot) => {
        const variantsForShot =
          state.materialVariantsByShot[state.activeSetId]?.[shot.id] ??
          DEFAULT_MATERIAL_VARIANTS;
        return getShotWithVariants(state.activeSetId, shot, variantsForShot);
      });
  },

  getSelectedShot: () => {
    const state = get();
    const shots = RENDER_SETS[state.activeSetId] ?? [];
    const shot =
      shots.find((candidate) => candidate.id === state.selectedRenderId) ??
      null;
    if (!shot) {
      return null;
    }
    const variantsForShot =
      state.materialVariantsByShot[state.activeSetId]?.[shot.id] ??
      DEFAULT_MATERIAL_VARIANTS;
    return getShotWithVariants(state.activeSetId, shot, variantsForShot);
  },
  getMaterialVariantsForShot: (setId, shotId) => {
    if (!setId || !shotId) {
      return DEFAULT_MATERIAL_VARIANTS;
    }
    const variantsForShot =
      get().materialVariantsByShot[setId]?.[shotId] ?? null;
    return variantsForShot ?? DEFAULT_MATERIAL_VARIANTS;
  },
  getAltText: (shotId) => get().altTextByShot[shotId] ?? "",
}));

export default useRenderingDemoStore;

