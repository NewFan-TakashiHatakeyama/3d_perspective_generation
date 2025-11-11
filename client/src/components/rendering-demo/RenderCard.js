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
    borderRadius="md"
    overflow="hidden"
    bg="gray.800"
    cursor="pointer"
    onClick={onSelect}
    position="relative"
    transition="border-color 0.2s ease"
    _hover={{ borderColor: "teal.300" }}
  >
    <Box position="relative">
      <Image
        src={shot.src}
        alt={shot.label}
        h="140px"
        w="100%"
        objectFit="cover"
        filter={toCssFilter(toneFilters)}
        fallbackSrc="https://placehold.co/320x180?text=Render"
      />
      <Box position="absolute" top={2} right={2}>
        <Checkbox
          colorScheme="teal"
          isChecked={isChecked}
          onChange={(e) => {
            e.stopPropagation();
            onToggle();
          }}
        />
      </Box>
      <Box position="absolute" bottom={2} left={2}>
        <Badge colorScheme="blackAlpha" textTransform="none">
          {shot.meta?.timeOfDay ?? "Day"}
        </Badge>
      </Box>
    </Box>
    <Box p={3}>
      <Flex align="center" justify="space-between" mb={2}>
        <Text fontWeight="semibold" fontSize="sm">
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
    </Box>
  </Box>
);

export default RenderCard;

