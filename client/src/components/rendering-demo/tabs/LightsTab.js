import {
  Button,
  ButtonGroup,
  Flex,
  Stack,
  Switch,
  Text,
} from "@chakra-ui/react";
import { LIGHTING_PRESETS } from "../../../lib/rendering-demo";
import SliderControl from "../ui/SliderControl";

const LightsTab = ({ lighting, onPreset, onChange }) => (
  <Stack spacing={5}>
    <Text fontSize="sm" color="gray.400">
      昼 / 夕 / 夜のライトセットをベースに微調整します。
    </Text>
    <Text fontSize="xs" color="gray.500" bg="blackAlpha.300" borderRadius="md" p={3}>
      ※ デモ版のため、照明設定を変更しても画像の色味・明るさには反映されません。
      操作イメージの確認用途になります。
    </Text>
    <ButtonGroup size="sm" variant="outline" colorScheme="teal">
      {LIGHTING_PRESETS.map((preset) => (
        <Button key={preset.id} onClick={() => onPreset(preset)}>
          {preset.label}
        </Button>
      ))}
    </ButtonGroup>
    <SliderControl
      label="強度"
      value={lighting.intensity}
      min={0}
      max={2}
      step={0.05}
      onChange={(value) => onChange({ intensity: value })}
    />
    <SliderControl
      label="色温 (K)"
      value={lighting.temperature}
      min={2500}
      max={6500}
      step={100}
      onChange={(value) => onChange({ temperature: value })}
    />
    <Flex align="center" justify="space-between">
      <Text fontSize="sm" color="gray.300">
        影を有効化
      </Text>
      <Switch
        colorScheme="teal"
        isChecked={lighting.castsShadow}
        onChange={(event) => onChange({ castsShadow: event.target.checked })}
      />
    </Flex>
  </Stack>
);

export default LightsTab;

