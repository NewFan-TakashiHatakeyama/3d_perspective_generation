import { useEffect, useRef } from "react";
import { useToast } from "@chakra-ui/react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import RenderingDemoShell from "./RenderingDemoShell";
import GalleryColumn from "./GalleryColumn";
import PreviewColumn from "./PreviewColumn";
import AdjustmentColumn from "./AdjustmentColumn";
import useRenderingDemoStore, { COMPARISON_MODES } from "../../store/useRenderingDemoStore";
import {
  DEFAULT_MATERIAL_VARIANTS,
  DEFAULT_TONE_FILTERS,
  TONE_PRESETS,
  TONE_PRESET_KEYS,
  toCssFilter,
} from "../../lib/rendering-demo";

const FALLBACK_RENDER_SRC = "https://placehold.co/1280x720?text=Render";

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => {
      if (src === FALLBACK_RENDER_SRC) {
        reject(new Error("画像の読み込みに失敗しました"));
        return;
      }
      img.src = FALLBACK_RENDER_SRC;
    };
    img.src = src;
  });

const fileNameFromShot = (shot) =>
  `${shot.id}_${shot.label.replace(/\s+/g, "_")}.png`;

const RenderingDemoPage = () => {
  const toast = useToast();
  const canvasRef = useRef(null);

  const activeSetId = useRenderingDemoStore((state) => state.activeSetId);
  const setActiveSetId = useRenderingDemoStore((state) => state.setActiveSetId);
  const toneFilters = useRenderingDemoStore((state) => state.toneFilters);
  const setToneFilterValue = useRenderingDemoStore((state) => state.setToneFilterValue);
  const applyTonePreset = useRenderingDemoStore((state) => state.applyTonePreset);
  const resetToneFilters = useRenderingDemoStore((state) => state.resetToneFilters);
  const activeTonePreset = useRenderingDemoStore((state) => state.activeTonePreset);
  const materialVariants = useRenderingDemoStore((state) =>
    state.getMaterialVariantsForShot(state.activeSetId, state.selectedRenderId) ??
    DEFAULT_MATERIAL_VARIANTS
  );
  const setMaterialVariant = useRenderingDemoStore((state) => state.setMaterialVariant);
  const lighting = useRenderingDemoStore((state) => state.lighting);
  const setLighting = useRenderingDemoStore((state) => state.setLighting);
  const setLightingPreset = useRenderingDemoStore((state) => state.setLightingPreset);
  const comparisonMode = useRenderingDemoStore((state) => state.comparisonMode);
  const setComparisonMode = useRenderingDemoStore((state) => state.setComparisonMode);
  const comparisonSliderPosition = useRenderingDemoStore((state) => state.comparisonSliderPosition);
  const setComparisonSliderPosition = useRenderingDemoStore((state) => state.setComparisonSliderPosition);
  const selectedRenderId = useRenderingDemoStore((state) => state.selectedRenderId);
  const selectedRenderIds = useRenderingDemoStore((state) => state.selectedRenderIds);
  const setSelectedRenderId = useRenderingDemoStore((state) => state.setSelectedRenderId);
  const toggleBulkSelection = useRenderingDemoStore((state) => state.toggleBulkSelection);
  const getAltText = useRenderingDemoStore((state) => state.getAltText);
  const setAltText = useRenderingDemoStore((state) => state.setAltText);

  const shots = useRenderingDemoStore((state) => state.getActiveShots());
  const selectedShot = useRenderingDemoStore((state) => state.getSelectedShot());
  const selectedShots = useRenderingDemoStore((state) => state.getSelectedShots());
  const selectedCount = selectedShots.length;
  const altText = selectedShot ? getAltText(selectedShot.id) : "";

  useEffect(() => {
    if (!selectedRenderId && shots.length > 0) {
      setSelectedRenderId(shots[0].id);
    }
  }, [selectedRenderId, shots, setSelectedRenderId]);

  const ensureComparisonMode = (mode) => {
    if (!COMPARISON_MODES.includes(mode)) return;
    setComparisonMode(mode);
  };

  const handleApplyPreset = (presetKey) => {
    const presetFilters = TONE_PRESETS[presetKey] ?? DEFAULT_TONE_FILTERS;
    applyTonePreset(presetKey, presetFilters);
  };

  const handleDownloadSingle = async (shot) => {
    if (!shot) {
      toast({
        title: "レンダーを選択してください",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    try {
      const img = await loadImage(shot.src);
      const canvas = canvasRef.current;
      if (!canvas) throw new Error("canvas not available");
      const ctx = canvas.getContext("2d");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.filter = toCssFilter(toneFilters);
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, fileNameFromShot(shot));
        }
      }, "image/png", 0.95);
    } catch (error) {
      console.error(error);
      toast({
        title: "ダウンロードに失敗しました",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDownloadZip = async () => {
    if (selectedCount === 0) {
      toast({
        title: "画像が選択されていません",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    try {
      const canvas = canvasRef.current;
      if (!canvas) throw new Error("canvas not available");
      const ctx = canvas.getContext("2d");
      const zip = new JSZip();

      for (const shot of selectedShots) {
        const img = await loadImage(shot.src);
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.filter = toCssFilter(toneFilters);
        ctx.drawImage(img, 0, 0);
        // eslint-disable-next-line no-await-in-loop
        const blob = await new Promise((resolve) =>
          canvas.toBlob((b) => resolve(b), "image/png", 0.95)
        );
        if (blob) {
          const arrayBuffer = await blob.arrayBuffer();
          zip.file(fileNameFromShot(shot), arrayBuffer);
        }
      }

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `renders_${activeSetId}.zip`);
    } catch (error) {
      console.error(error);
      toast({
        title: "ZIP生成に失敗しました",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const exportState = {
    selectedShot,
    selectedCount,
    altText,
    onAltTextChange: (value) => selectedShot && setAltText(selectedShot.id, value),
    onDownloadSingle: () => handleDownloadSingle(selectedShot),
    onDownloadZip: handleDownloadZip,
  };

  return (
    <>
      <RenderingDemoShell
        title="パチンコ店舗 3Dパース 生成"
        step={2}
        left={
          <GalleryColumn
            activeSetId={activeSetId}
            onSetChange={setActiveSetId}
            shots={shots}
            toneFilters={toneFilters}
            selectedRenderId={selectedRenderId}
            selectedIds={selectedRenderIds}
            onSelectShot={setSelectedRenderId}
            onToggleBulk={toggleBulkSelection}
            onDownloadShot={handleDownloadSingle}
          />
        }
        center={
          <PreviewColumn
            shot={selectedShot}
            toneFilters={toneFilters}
            tonePresets={TONE_PRESET_KEYS}
            activeTonePreset={activeTonePreset}
            onPresetApply={handleApplyPreset}
            onResetTone={resetToneFilters}
            comparisonMode={comparisonMode}
            onComparisonModeChange={ensureComparisonMode}
            comparisonSliderPosition={comparisonSliderPosition}
            onSliderChange={setComparisonSliderPosition}
            exportState={exportState}
          />
        }
        right={
          <AdjustmentColumn
            toneFilters={toneFilters}
            onToneChange={setToneFilterValue}
            materialVariants={materialVariants}
            onMaterialChange={(groupId, variantId) => {
              if (!selectedRenderId) return;
              setMaterialVariant(activeSetId, selectedRenderId, groupId, variantId);
            }}
            lighting={lighting}
            onLightingChange={setLighting}
            onLightingPreset={setLightingPreset}
          />
        }
      />
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </>
  );
};

export default RenderingDemoPage;

