import { Stack, Text } from "@chakra-ui/react";
import {
  FILTER_SLIDERS,
} from "../../../lib/rendering-demo";
import SliderControl from "../ui/SliderControl";

const ToneTab = ({ toneFilters, onChange }) => (
  <Stack spacing={4}>
    <Text fontSize="sm" color="gray.400">
      色やトーンを調整します。
    </Text>
    {FILTER_SLIDERS.map((slider) => (
      <SliderControl
        key={slider.key}
        label={slider.label}
        value={toneFilters[slider.key]}
        min={slider.min}
        max={slider.max}
        step={slider.step}
        onChange={(value) => onChange(slider.key, value)}
      />
    ))}
  </Stack>
);

export default ToneTab;

