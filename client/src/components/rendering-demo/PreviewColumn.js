import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  Icon,
  Image,
  SimpleGrid,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { FiGrid, FiSliders, FiTrendingUp, FiAperture } from "react-icons/fi";
import { toCssFilter } from "../../lib/rendering-demo";
import ExportTab from "./tabs/ExportTab";
import { useNavigate } from "react-router-dom";

const renderComparisonContent = ({
  mode,
  shot,
  toneFilters,
  sliderPosition,
  onSliderChange,
}) => {
  const filteredImage = (
    <Image
      key="filtered"
      src={shot.src}
      alt={shot.label}
      objectFit="contain"
      w="100%"
      h="100%"
      filter={toCssFilter(toneFilters)}
      maxH="540px"
      fallbackSrc="https://placehold.co/960x540?text=Render"
    />
  );

  const baseImage = (
    <Image
      key="base"
      src={shot.src}
      alt={`${shot.label} (before)`}
      objectFit="contain"
      w="100%"
      h="100%"
      maxH="540px"
      fallbackSrc="https://placehold.co/960x540?text=Render"
    />
  );

  if (mode === "split") {
    return (
      <SimpleGrid columns={2} spacing={4} w="100%">
        <Box>
          <Text fontSize="xs" color="gray.400" mb={2}>
            Before
          </Text>
          {baseImage}
        </Box>
        <Box>
          <Text fontSize="xs" color="gray.400" mb={2}>
            After
          </Text>
          {filteredImage}
        </Box>
      </SimpleGrid>
    );
  }

  if (mode === "slider") {
    return (
      <Box position="relative" w="100%" h="100%" maxH="540px">
        {baseImage}
        <Box
          position="absolute"
          top={0}
          left={0}
          bottom={0}
          width={`${sliderPosition}%`}
          overflow="hidden"
          pointerEvents="none"
        >
          {filteredImage}
        </Box>
        <Box position="absolute" bottom={4} left="50%" transform="translateX(-50%)" w="60%">
          <Slider
            value={sliderPosition}
            onChange={onSliderChange}
            min={0}
            max={100}
            colorScheme="teal"
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb boxSize={5} />
          </Slider>
        </Box>
      </Box>
    );
  }

  return filteredImage;
};

const PreviewColumn = ({
  shot,
  toneFilters,
  tonePresets,
  activeTonePreset,
  onPresetApply,
  onResetTone,
  comparisonMode,
  onComparisonModeChange,
  comparisonSliderPosition,
  onSliderChange,
  exportState,
}) => {
  const navigate = useNavigate();

  return (
    <Stack spacing={4}>
      <Flex justify="space-between" align="center">
        <Box>
          <Text fontSize="sm" color="gray.400">
            プレビュー
          </Text>
          <HStack spacing={3} mt={1}>
            <Text fontSize="lg" fontWeight="semibold">
              {shot ? `${shot.id}. ${shot.label}` : "レンダーを選択してください"}
            </Text>
            {shot?.tags?.map((tag) => (
              <Badge key={tag} colorScheme="teal" textTransform="none">
                {tag}
              </Badge>
            ))}
          </HStack>
        </Box>
        <Tooltip label="デモ用のVR動画を表示" fontSize="xs">
          <Button
            size="sm"
            leftIcon={<Icon as={FiAperture} />}
            variant="outline"
            colorScheme="teal"
            onClick={() => navigate("/preview/vr")}
            isDisabled={!shot}
          >
            VR で見る
          </Button>
        </Tooltip>
      </Flex>

      <Box
        borderWidth="1px"
        borderColor="gray.700"
        borderRadius="xl"
        bg="gray.800"
        p={4}
        minH="560px"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {shot
          ? renderComparisonContent({
              mode: comparisonMode,
              shot,
              toneFilters,
              sliderPosition: comparisonSliderPosition,
              onSliderChange,
            })
          : (
            <Text color="gray.500" fontSize="sm">
              左のギャラリーから表示したいレンダーを選択してください。
            </Text>
          )}
      </Box>

      <Box
        borderWidth="1px"
        borderColor="gray.700"
        borderRadius="lg"
        bg="gray.800"
        p={4}
      >
        <Flex justify="space-between" align="center" mb={3}>
          <Text fontSize="sm" fontWeight="semibold">
            プリセット
          </Text>
          <Button size="xs" variant="ghost" colorScheme="teal" onClick={onResetTone}>
            リセット
          </Button>
        </Flex>
        <HStack spacing={2} wrap="wrap">
          {tonePresets.map((preset) => {
            const isActive = activeTonePreset === preset;
            return (
              <Button
                key={preset}
                size="sm"
                variant={isActive ? "solid" : "outline"}
                colorScheme="teal"
                onClick={() => onPresetApply(preset)}
              >
                {preset}
              </Button>
            );
          })}
        </HStack>
      </Box>

      <Box
        borderWidth="1px"
        borderColor="gray.700"
        borderRadius="lg"
        bg="gray.800"
        p={4}
      >
        <Text fontSize="sm" fontWeight="semibold" mb={3}>
          比較モード
        </Text>
        <ButtonGroup size="sm" variant="outline" colorScheme="teal">
          <Button
            leftIcon={<Icon as={FiTrendingUp} />}
            isActive={comparisonMode === "single"}
            onClick={() => onComparisonModeChange("single")}
          >
            Single
          </Button>
          <Button
            leftIcon={<Icon as={FiGrid} />}
            isActive={comparisonMode === "split"}
            onClick={() => onComparisonModeChange("split")}
          >
            Split
          </Button>
          <Button
            leftIcon={<Icon as={FiSliders} />}
            isActive={comparisonMode === "slider"}
            onClick={() => onComparisonModeChange("slider")}
          >
            Slider
          </Button>
        </ButtonGroup>
      </Box>

      <Box
        borderWidth="1px"
        borderColor="gray.700"
        borderRadius="lg"
        bg="gray.800"
        p={4}
      >
        <ExportTab {...exportState} />
      </Box>
    </Stack>
  );
};

export default PreviewColumn;

