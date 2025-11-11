import {
  Badge,
  Box,
  Checkbox,
  Flex,
  IconButton,
  Image,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { DownloadIcon } from "@chakra-ui/icons";
import { toCssFilter } from "../../lib/rendering-demo";

const RenderCard = ({
  shot,
  toneFilters,
  isActive,
  isChecked,
  onSelect,
  onToggle,
  onDownload,
}) => (
  <Box
    borderWidth="1px"
    borderColor={isActive ? "teal.400" : "gray.700"}
    borderRadius="lg"
    bg="gray.800"
    cursor="pointer"
    onClick={onSelect}
    transition="border-color 0.2s ease"
    _hover={{ borderColor: "teal.300" }}
    p={3}
  >
    <Flex gap={4} align="stretch">
      <Box position="relative" flexShrink={0}>
        <Image
          src={shot.src}
          alt={shot.label}
          w="132px"
          h="92px"
          objectFit="cover"
          borderRadius="md"
          filter={toCssFilter(toneFilters)}
          fallbackSrc="https://placehold.co/200x120?text=Render"
        />
        <Box position="absolute" top={1} right={1}>
          <Checkbox
            colorScheme="teal"
            size="sm"
            isChecked={isChecked}
            onChange={(e) => {
              e.stopPropagation();
              onToggle();
            }}
          />
        </Box>
        <Badge position="absolute" bottom={1} left={1} colorScheme="blackAlpha" textTransform="none">
          {shot.meta?.timeOfDay ?? "Day"}
        </Badge>
      </Box>

      <Flex direction="column" flex="1" justify="space-between" gap={2}>
        <Flex justify="space-between" align="flex-start">
          <Text fontWeight="semibold" fontSize="sm" color="white">
            {shot.id}. {shot.label}
          </Text>
          <Tooltip label="この画像をダウンロード">
            <IconButton
              aria-label="download"
              icon={<DownloadIcon />}
              size="sm"
              variant="ghost"
              colorScheme="teal"
              onClick={(e) => {
                e.stopPropagation();
                onDownload();
              }}
            />
          </Tooltip>
        </Flex>
        <Flex fontSize="xs" color="gray.400" direction="column" gap={1}>
          <Text>アングル: {shot.meta?.angle ?? "N/A"}</Text>
          <Text>焦点距離: {shot.meta?.focalLength ?? "—"}mm</Text>
        </Flex>
      </Flex>
    </Flex>
  </Box>
);

export default RenderCard;

