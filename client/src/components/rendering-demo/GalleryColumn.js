import {
  Box,
  Select,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import RenderCard from "./RenderCard";
import { RENDER_SETS } from "../../lib/rendering-demo";

const GalleryColumn = ({
  activeSetId,
  onSetChange,
  shots,
  toneFilters,
  selectedRenderId,
  selectedIds,
  onSelectShot,
  onToggleBulk,
  onDownloadShot,
}) => {
  return (
    <Stack spacing={6}>
      <Box>
        <Text fontSize="sm" fontWeight="semibold" mb={2}>
          既存レンダーセット
        </Text>
        <Select
          size="sm"
          bg="gray.900"
          borderColor="gray.700"
          value={activeSetId}
          onChange={(event) => onSetChange(event.target.value)}
        >
          {Object.keys(RENDER_SETS).map((setId) => (
            <option key={setId} value={setId}>
              {setId}
            </option>
          ))}
        </Select>
      </Box>

      <Text fontSize="sm" color="gray.400">
        {shots.length} 件のレンダー
      </Text>

      <SimpleGrid columns={1} spacing={3}>
        {shots.map((shot) => (
          <RenderCard
            key={`${activeSetId}-${shot.id}`}
            shot={shot}
            toneFilters={toneFilters}
            isActive={selectedRenderId === shot.id}
            isChecked={!!selectedIds[shot.id]}
            onSelect={() => onSelectShot(shot.id)}
            onToggle={() => onToggleBulk(shot.id)}
            onDownload={() => onDownloadShot(shot)}
          />
        ))}
        {shots.length === 0 && (
          <Box
            borderWidth="1px"
            borderColor="gray.700"
            borderRadius="md"
            p={6}
            textAlign="center"
            color="gray.500"
          >
            条件に合致するレンダーがありません
          </Box>
        )}
      </SimpleGrid>
    </Stack>
  );
};

export default GalleryColumn;

