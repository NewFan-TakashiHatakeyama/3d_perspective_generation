import {
  Box,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import ToneTab from "./tabs/ToneTab";
import MaterialTab from "./tabs/MaterialTab";
import LightsTab from "./tabs/LightsTab";
const AdjustmentColumn = ({
  toneFilters,
  onToneChange,
  materialVariants,
  onMaterialChange,
  lighting,
  onLightingChange,
  onLightingPreset,
}) => (
  <Box
    borderWidth="1px"
    borderColor="gray.700"
    borderRadius="xl"
    bg="gray.800"
    overflow="hidden"
  >
    <Tabs isLazy orientation="horizontal" colorScheme="teal">
      <TabList bg="gray.900">
        <Tab fontSize="sm">色・トーン</Tab>
        <Tab fontSize="sm">材質</Tab>
        <Tab fontSize="sm">照明</Tab>
      </TabList>
      <TabPanels p={4} maxH="calc(100vh - 220px)" overflowY="auto">
        <TabPanel>
          <ToneTab toneFilters={toneFilters} onChange={onToneChange} />
        </TabPanel>
        <TabPanel>
          <MaterialTab
            materialVariants={materialVariants}
            onChange={onMaterialChange}
          />
        </TabPanel>
        <TabPanel>
          <LightsTab
            lighting={lighting}
            onPreset={onLightingPreset}
            onChange={onLightingChange}
          />
        </TabPanel>
      </TabPanels>
    </Tabs>
  </Box>
);

export default AdjustmentColumn;

