import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  IconButton,
  Image,
  Input,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiCamera,
  FiUploadCloud,
  FiHelpCircle,
} from "react-icons/fi";
import useRenderingDemoStore from "../../store/useRenderingDemoStore";
import { StepIndicator, STEPS } from "../rendering-demo/RenderingDemoShell";

const DEFAULT_HELP = {
  drawings: "外観：平面・立面・配置・外構図。内観：平面・展開・床伏・配灯・詳細図（可能ならCADデータ）。",
  materials: "仕上表（壁・床・天井）、品番・色番（マンセル・日塗工など）、製品ページURL。",
  lighting: "配灯図・器具表・色温度。内観の雰囲気を決める重要要素です。",
  direction: "参考写真／ムードボード（Pinterest 等）、ブランドガイド、想定客層。",
  delivery: "画像サイズ・形式、想定アングル、時間帯（昼／夕／夜）、必要点数などを事前に定義します。",
};

const UploadCard = ({
  fileUrl,
  fileName,
  onSelectFile,
}) => {
  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const openFileDialog = () => {
    inputRef.current?.click();
  };

  const handleFiles = (files) => {
    if (!files || !files.length) return;
    onSelectFile(files[0]);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    handleFiles(event.dataTransfer.files);
  };

  return (
    <Box
      borderWidth="1px"
      borderColor={dragActive ? "teal.400" : "gray.700"}
      borderRadius="2xl"
      bg="gray.900"
      p={6}
      minH="420px"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      transition="border-color 0.2s ease"
    >
      <Stack spacing={4}>
        <Heading as="h3" size="sm" display="flex" alignItems="center" gap={3}>
          <Icon as={FiCamera} color="teal.300" />
          画像のアップロード
        </Heading>
        <Box
          border="2px dashed"
          borderColor={dragActive ? "teal.400" : "gray.600"}
          borderRadius="xl"
          bg="blackAlpha.400"
          p={10}
          textAlign="center"
          cursor="pointer"
          onClick={openFileDialog}
        >
          {fileUrl ? (
            <Stack spacing={4} align="center">
              <Image
                src={fileUrl}
                alt={fileName ?? "Uploaded reference"}
                maxH="220px"
                objectFit="contain"
                borderRadius="lg"
              />
              <Text fontSize="sm" color="gray.300">
                {fileName}
              </Text>
              <Button
                leftIcon={<Icon as={FiUploadCloud} />}
                variant="outline"
                size="sm"
                colorScheme="teal"
                onClick={openFileDialog}
              >
                画像を変更
              </Button>
            </Stack>
          ) : (
            <Stack spacing={3} align="center" color="gray.300">
              <Icon as={FiUploadCloud} boxSize={10} color="teal.300" />
              <Text fontWeight="semibold">画像をドラッグ＆ドロップ</Text>
              <Text fontSize="sm">またはクリックして選択</Text>
            </Stack>
          )}
        </Box>
        <Input
          ref={inputRef}
          type="file"
          accept="image/*"
          display="none"
          onChange={(event) => handleFiles(event.target.files)}
        />
      </Stack>
      <Box fontSize="xs" color="gray.500" mt={4}>
        * CAD 図面や低解像プラン画像など、レファレンスとして使いたい画像をアップロードしてください。
      </Box>
    </Box>
  );
};

const LabelWithHelp = ({ label, help }) => (
  <Flex align="center" gap={1}>
    <Text>{label}</Text>
    <Tooltip label={help} fontSize="xs" hasArrow placement="top">
      <IconButton
        aria-label={`${label}の説明`}
        icon={<FiHelpCircle />}
        size="xs"
        variant="ghost"
        colorScheme="teal"
      />
    </Tooltip>
  </Flex>
);

const selectOptionStyles = {
  "& option": {
    color: "gray.900",
    backgroundColor: "white",
  },
};

const SetupForm = ({ values, onChange }) => {
  return (
    <Stack spacing={6}>
    <Box
      borderWidth="1px"
      borderColor="gray.700"
      borderRadius="xl"
      bg="gray.900"
      p={5}
    >
      <Text fontWeight="semibold" mb={3}>
        必要図面
      </Text>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <FormControl>
          <FormLabel fontSize="sm" color="gray.400">
            <LabelWithHelp
              label="外観図面ファイル数"
              help={DEFAULT_HELP.drawings}
            />
          </FormLabel>
          <Input
            type="number"
            min={0}
            value={values.drawings.exteriorCount}
            onChange={(event) =>
              onChange("drawings", "exteriorCount", event.target.value)
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel fontSize="sm" color="gray.400">
            <LabelWithHelp
              label="内観図面ファイル数"
              help={DEFAULT_HELP.drawings}
            />
          </FormLabel>
          <Input
            type="number"
            min={0}
            value={values.drawings.interiorCount}
            onChange={(event) =>
              onChange("drawings", "interiorCount", event.target.value)
            }
          />
        </FormControl>
      </SimpleGrid>
    </Box>

    <Box
      borderWidth="1px"
      borderColor="gray.700"
      borderRadius="xl"
      bg="gray.900"
      p={5}
    >
      <Text fontWeight="semibold" mb={3}>
        マテリアル情報
      </Text>
      <FormControl>
        <FormLabel fontSize="sm" color="gray.400">
          <LabelWithHelp
            label="仕上表・カタログURL"
            help={DEFAULT_HELP.materials}
          />
        </FormLabel>
        <Input
          placeholder="https://..."
          value={values.materials.finishSheetUrl}
          onChange={(event) =>
            onChange("materials", "finishSheetUrl", event.target.value)
          }
        />
      </FormControl>
    </Box>

    <Box
      borderWidth="1px"
      borderColor="gray.700"
      borderRadius="xl"
      bg="gray.900"
      p={5}
    >
      <Text fontWeight="semibold" mb={3}>
        照明計画
      </Text>
      <FormControl>
        <FormLabel fontSize="sm" color="gray.400">
          <LabelWithHelp
            label="想定色温度 (K)"
            help={DEFAULT_HELP.lighting}
          />
        </FormLabel>
        <Input
          type="number"
          min={2000}
          max={8000}
          step={100}
          value={values.lighting.colorTemperature}
          onChange={(event) =>
            onChange("lighting", "colorTemperature", event.target.value)
          }
        />
      </FormControl>
    </Box>

    <Box
      borderWidth="1px"
      borderColor="gray.700"
      borderRadius="xl"
      bg="gray.900"
      p={5}
    >
      <Text fontWeight="semibold" mb={3}>
        方向性資料
      </Text>
      <FormControl>
        <FormLabel fontSize="sm" color="gray.400">
          <LabelWithHelp
            label="参考写真／ムードボードURL"
            help={DEFAULT_HELP.direction}
          />
        </FormLabel>
        <Input
          placeholder="https://..."
          value={values.direction.moodboardUrl}
          onChange={(event) =>
            onChange("direction", "moodboardUrl", event.target.value)
          }
        />
      </FormControl>
      <FormControl mt={4}>
        <FormLabel fontSize="sm" color="gray.400">
          <LabelWithHelp
            label="想定客層・ブランドトーン"
            help={DEFAULT_HELP.direction}
          />
        </FormLabel>
        <Input
          value={values.direction.targetAudience}
          onChange={(event) =>
            onChange("direction", "targetAudience", event.target.value)
          }
        />
      </FormControl>
    </Box>

    <Box
      borderWidth="1px"
      borderColor="gray.700"
      borderRadius="xl"
      bg="gray.900"
      p={5}
    >
      <Text fontWeight="semibold" mb={3}>
        納品仕様
      </Text>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <FormControl>
          <FormLabel fontSize="sm" color="gray.400">
            <LabelWithHelp
              label="必要点数"
              help={DEFAULT_HELP.delivery}
            />
          </FormLabel>
          <Input
            type="number"
            min={1}
            value={values.delivery.imageCount}
            onChange={(event) =>
              onChange("delivery", "imageCount", event.target.value)
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel fontSize="sm" color="gray.400">
            <LabelWithHelp
              label="納品形式"
              help={DEFAULT_HELP.delivery}
            />
          </FormLabel>
          <Select
            placeholder="形式を選択"
            value={values.delivery.format}
          color="gray.100"
          bg="gray.900"
          borderColor="gray.700"
          sx={selectOptionStyles}
            onChange={(event) =>
              onChange("delivery", "format", event.target.value)
            }
          >
            <option value="png">PNG (透過対応)</option>
            <option value="jpeg">JPEG (圧縮)</option>
            <option value="tiff">TIFF (印刷向け)</option>
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel fontSize="sm" color="gray.400">
              <LabelWithHelp
                label="想定時間帯"
              help={DEFAULT_HELP.delivery}
              />
          </FormLabel>
          <Select
            value={values.delivery.timeOfDay}
          color="gray.100"
          bg="gray.900"
          borderColor="gray.700"
          sx={selectOptionStyles}
            onChange={(event) =>
              onChange("delivery", "timeOfDay", event.target.value)
            }
          >
            <option value="day">昼景</option>
            <option value="evening">夕景</option>
            <option value="night">夜景</option>
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel fontSize="sm" color="gray.400">
              <LabelWithHelp
                label="推奨解像度"
              help={DEFAULT_HELP.delivery}
              />
          </FormLabel>
          <Select
            placeholder="解像度を選択"
            value={values.delivery.resolution}
          color="gray.100"
          bg="gray.900"
          borderColor="gray.700"
          sx={selectOptionStyles}
            onChange={(event) =>
              onChange("delivery", "resolution", event.target.value)
            }
          >
            <option value="4k">3840×2160 (4K)</option>
            <option value="5k">5120×2880 (5K)</option>
            <option value="print-a1">7016×4961 (A1印刷想定)</option>
          </Select>
        </FormControl>
      </SimpleGrid>
    </Box>

    <Box fontSize="xs" color="gray.500">
      * 各項目横の ? ボタンから入力ガイドを確認できます。
    </Box>
    </Stack>
  );
};

const SetupPage = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const uploadedFloorPlan = useRenderingDemoStore(
    (state) => state.uploadedFloorPlan
  );
  const uploadedFloorPlanName = useRenderingDemoStore(
    (state) => state.uploadedFloorPlanName
  );
  const setUploadedFloorPlan = useRenderingDemoStore(
    (state) => state.setUploadedFloorPlan
  );
  const projectBrief = useRenderingDemoStore((state) => state.projectBrief);
  const setProjectBriefField = useRenderingDemoStore(
    (state) => state.setProjectBriefField
  );

  const previousUrlRef = useRef(null);

  useEffect(() => () => {
    if (previousUrlRef.current) {
      URL.revokeObjectURL(previousUrlRef.current);
    }
  }, []);

  const handleSelectFile = (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (previousUrlRef.current) {
      URL.revokeObjectURL(previousUrlRef.current);
    }
    previousUrlRef.current = url;
    setUploadedFloorPlan(url, file.name);
    toast({
      title: "画像を読み込みました",
      description: file.name,
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const isReady = useMemo(() => {
    const requiredTextFields = [
      projectBrief.materials.finishSheetUrl,
      projectBrief.direction.moodboardUrl,
      projectBrief.direction.targetAudience,
      projectBrief.delivery.format,
      projectBrief.delivery.resolution,
    ];
    const requiredNumberFields = [
      projectBrief.drawings.exteriorCount,
      projectBrief.drawings.interiorCount,
      projectBrief.lighting.colorTemperature,
      projectBrief.delivery.imageCount,
    ];
    const timeOfDaySelected = !!projectBrief.delivery.timeOfDay;
    const allTextFilled = requiredTextFields.every(
      (value) => value && value.toString().trim().length > 0
    );
    const allNumberValid = requiredNumberFields.every(
      (value) => value && Number(value) > 0
    );
    return (
      !!uploadedFloorPlan &&
      allTextFilled &&
      allNumberValid &&
      timeOfDaySelected
    );
  }, [uploadedFloorPlan, projectBrief]);

  const handleProceed = () => {
    toast({
      title: "3Dパースを生成しています...",
      description: "レンダリング処理が完了するとプレビューに移動します。",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
    setTimeout(() => {
      navigate("/preview");
    }, 2500);
  };

  return (
    <Box bg="gray.900" minH="100vh" color="gray.100" pb={16}>
      <Box borderBottom="1px solid" borderColor="gray.700" bg="gray.950">
        <Flex
          maxW="1200px"
          mx="auto"
          px={{ base: 4, md: 6 }}
          py={5}
          align="center"
          justify="space-between"
        >
          <Box>
            <Heading as="h1" fontSize="lg" fontWeight="semibold">
              パチンコ店舗 3Dパース プレビュー
            </Heading>
            <Text fontSize="sm" color="gray.500">
              ステップ 1 / {STEPS.length} : 画像と制作要件の準備
            </Text>
          </Box>
          <StepIndicator current={1} />
        </Flex>
      </Box>

      <Box maxW="1200px" mx="auto" px={{ base: 4, md: 6 }} pt={10}>
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
          <UploadCard
            fileUrl={uploadedFloorPlan}
            fileName={uploadedFloorPlanName}
            onSelectFile={handleSelectFile}
          />
          <SetupForm values={projectBrief} onChange={setProjectBriefField} />
        </SimpleGrid>

        <Flex justify="flex-end" mt={10}>
          <Button
            colorScheme="teal"
            size="lg"
            rightIcon={<FiArrowRight />}
            onClick={handleProceed}
            isDisabled={!isReady}
          >
            3Dパース作成
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

export default SetupPage;

