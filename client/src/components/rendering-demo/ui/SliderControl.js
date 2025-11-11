import {
  Flex,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
} from "@chakra-ui/react";

const SliderControl = ({ label, value, min, max, step, onChange, suffix }) => (
  <Flex direction="column" gap={2}>
    <Flex justify="space-between" fontSize="sm">
      <Text color="gray.300">{label}</Text>
      <Text color="gray.400">
        {value}
        {suffix ? suffix : ""}
      </Text>
    </Flex>
    <Slider
      value={value}
      onChange={onChange}
      min={min}
      max={max}
      step={step}
      colorScheme="teal"
    >
      <SliderTrack>
        <SliderFilledTrack />
      </SliderTrack>
      <SliderThumb boxSize={4} />
    </Slider>
  </Flex>
);

export default SliderControl;

