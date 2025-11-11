import {
  Box,
  Flex,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from "@chakra-ui/react";
import { MATERIAL_VARIANT_GROUPS } from "../../../lib/rendering-demo";

const MaterialTab = ({ materialVariants, onChange }) => (
  <Stack spacing={6}>
    <Text fontSize="sm" color="gray.400">
      床・壁・什器の配色を管理します。
    </Text>
    {MATERIAL_VARIANT_GROUPS.map((group) => (
      <Box key={group.id}>
        <Text fontSize="sm" fontWeight="semibold" mb={2}>
          {group.label}
        </Text>
        <RadioGroup
          value={materialVariants[group.id]}
          onChange={(value) => onChange(group.id, value)}
        >
          <Stack spacing={2}>
            {group.variants.map((variant) => (
              <Radio key={variant.id} value={variant.id} colorScheme="teal">
                <Flex align="center" gap={2}>
                  <Box
                    w="16px"
                    h="16px"
                    borderRadius="full"
                    border="1px solid"
                    borderColor="gray.600"
                    bg={variant.previewColor}
                  />
                  <Text fontSize="sm">{variant.label}</Text>
                </Flex>
              </Radio>
            ))}
          </Stack>
        </RadioGroup>
      </Box>
    ))}
  </Stack>
);

export default MaterialTab;

