import { Box, Flex, Heading, HStack, Text } from "@chakra-ui/react";

export const STEPS = [
  { id: 1, label: "画像セット選択" },
  { id: 2, label: "プレビュー & 編集" },
  { id: 3, label: "出力" },
];

export const StepIndicator = ({ current = 1 }) => (
  <HStack spacing={6}>
    {STEPS.map((step) => {
      const isActive = step.id === current;
      return (
        <HStack key={step.id} spacing={2}>
          <Box
            w="24px"
            h="24px"
            borderRadius="full"
            bg={isActive ? "teal.400" : "gray.600"}
            color="white"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontWeight="bold"
            fontSize="sm"
          >
            {step.id}
          </Box>
          <Text fontSize="sm" color={isActive ? "white" : "gray.400"}>
            {step.label}
          </Text>
        </HStack>
      );
    })}
  </HStack>
);

const RenderingDemoShell = ({ title, step = 1, left, center, right }) => (
  <Box bg="gray.900" color="gray.100" minH="100vh">
    <Box borderBottom="1px solid" borderColor="gray.700" bg="gray.950">
      <Flex
        maxW="1320px"
        mx="auto"
        px={6}
        py={4}
        align="center"
        justify="space-between"
      >
        <Heading as="h1" fontSize="lg" fontWeight="semibold">
          {title}
        </Heading>
        <StepIndicator current={step} />
      </Flex>
    </Box>
    <Flex maxW="1320px" mx="auto" px={6} py={6} gap={6}>
      <Box w="320px" flexShrink={0}>
        {left}
      </Box>
      <Box flex="1 1 0" minW="0">
        {center}
      </Box>
      <Box w="360px" flexShrink={0}>
        {right}
      </Box>
    </Flex>
  </Box>
);

export default RenderingDemoShell;

