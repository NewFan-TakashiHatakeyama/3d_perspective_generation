import {
  Button,
  ButtonGroup,
  Stack,
  Text,
} from "@chakra-ui/react";
import { CAMERA_PRESETS } from "../../../lib/rendering-demo";
import SliderControl from "../ui/SliderControl";

const CameraTab = ({ camera, onPreset, onChange }) => (
  <Stack spacing={5}>
    <ButtonGroup size="sm" variant="outline" colorScheme="teal" flexWrap="wrap">
      {CAMERA_PRESETS.map((preset) => (
        <Button
          key={preset.id}
          onClick={() => onPreset(preset)}
          title={preset.description}
        >
          {preset.label}
        </Button>
      ))}
    </ButtonGroup>
    <SliderControl
      label="焦点距離 (FOV)"
      value={camera.fov}
      min={18}
      max={70}
      step={1}
      onChange={(value) => onChange({ fov: value })}
      suffix="°"
    />
    <SliderControl
      label="露出 (EV)"
      value={camera.exposure}
      min={-1}
      max={1}
      step={0.05}
      onChange={(value) => onChange({ exposure: parseFloat(value.toFixed(2)) })}
    />
  </Stack>
);

export default CameraTab;

