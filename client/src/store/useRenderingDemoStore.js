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

const useRenderingDemoStore = create((set, get) => ({
  activeSetId: DEFAULT_RENDER_SET_ID,
  activeTag: "all",
  selectedRenderId: getFirstShotId(DEFAULT_RENDER_SET_ID),
  selectedRenderIds: {},
  altTextByShot: {},
  toneFilters: cloneToneFilters(),
  activeTonePreset: "Neutral",
  materialVariants: cloneMaterialVariants(),
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

  setMaterialVariant: (groupId, variantId) =>
    set((state) => ({
      materialVariants: { ...state.materialVariants, [groupId]: variantId },
    })),

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
    return filtered.map((shot) =>
      getShotWithVariants(state.activeSetId, shot, state.materialVariants)
    );
  },

  getSelectedShots: () => {
    const state = get();
    const shots = RENDER_SETS[state.activeSetId] ?? [];
    const selectedIds = Object.keys(state.selectedRenderIds);
    return shots
      .filter((shot) => selectedIds.includes(shot.id))
      .map((shot) =>
        getShotWithVariants(state.activeSetId, shot, state.materialVariants)
      );
  },

  getSelectedShot: () => {
    const state = get();
    const shots = RENDER_SETS[state.activeSetId] ?? [];
    const shot =
      shots.find((candidate) => candidate.id === state.selectedRenderId) ??
      null;
    return shot
      ? getShotWithVariants(state.activeSetId, shot, state.materialVariants)
      : null;
  },
  getAltText: (shotId) => get().altTextByShot[shotId] ?? "",
}));

export default useRenderingDemoStore;

