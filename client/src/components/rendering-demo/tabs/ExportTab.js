import { Box, Button, Stack, Text } from "@chakra-ui/react";

const ExportTab = ({
  selectedShot,
  selectedCount,
  onDownloadSingle,
  onDownloadZip,
}) => (
  <Stack spacing={4}>
    <Stack spacing={3}>
      <Button
        colorScheme="teal"
        onClick={onDownloadSingle}
        isDisabled={!selectedShot}
      >
        この画像をダウンロード
      </Button>
      <Button
        colorScheme="teal"
        variant="outline"
        onClick={onDownloadZip}
        isDisabled={selectedCount === 0}
      >
        選択した{selectedCount}枚をZIPでダウンロード
      </Button>
    </Stack>

    {selectedShot && (
      <Box borderTop="1px solid" borderColor="gray.700" pt={3}>
        <Text fontSize="xs" color="gray.500">
          ファイル名: {selectedShot.id}_{selectedShot.label.replace(/\s+/g, "_")}.png
        </Text>
      </Box>
    )}
  </Stack>
);

export default ExportTab;

