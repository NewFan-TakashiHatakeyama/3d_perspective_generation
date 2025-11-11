import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiVideo } from "react-icons/fi";
import { useMemo, useState } from "react";
import useRenderingDemoStore from "../../store/useRenderingDemoStore";

const VRViewerPage = () => {
  const navigate = useNavigate();
  const selectedShot = useRenderingDemoStore((state) => state.getSelectedShot());
  const [loadError, setLoadError] = useState(false);

  const { videoSrc, setId } = useMemo(() => {
    if (!selectedShot) return { videoSrc: null, setId: null };
    const parts = selectedShot.src.replace(/^\//, "").split("/");
    if (parts.length < 3) return { videoSrc: null, setId: null };
    const resolvedSetId = parts[1];
    const fileNameWithoutExt = parts[2]?.split(".")[0];
    if (!resolvedSetId || !fileNameWithoutExt) return { videoSrc: null, setId: null };
    return {
      videoSrc: `/renders/${resolvedSetId}/${fileNameWithoutExt}_vr.mp4`,
      setId: resolvedSetId,
    };
  }, [selectedShot]);

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
          <Stack spacing={1}>
            <Heading as="h1" fontSize="lg" fontWeight="semibold" display="flex" alignItems="center" gap={2}>
              <Icon as={FiVideo} />
              VR ビューア
            </Heading>
            <Text fontSize="sm" color="gray.500">
              生成された 3D パースを動画として閲覧できます。
            </Text>
          </Stack>
          <Button
            leftIcon={<FiArrowLeft />}
            variant="outline"
            colorScheme="teal"
            onClick={() => navigate("/preview")}
          >
            プレビューに戻る
          </Button>
        </Flex>
      </Box>

      <Box maxW="1200px" mx="auto" px={{ base: 4, md: 6 }} pt={10}>
        {videoSrc && !loadError ? (
          <Box
            borderWidth="1px"
            borderColor="gray.700"
            borderRadius="xl"
            overflow="hidden"
            bg="black"
            boxShadow="0 20px 60px rgba(0, 0, 0, 0.4)"
          >
            <video
              src={videoSrc}
              controls
              autoPlay
              onError={() => setLoadError(true)}
              style={{ width: "100%", height: "auto" }}
            >
              お使いのブラウザは video タグに対応していません。
            </video>
          </Box>
        ) : (
          <Box
            borderWidth="1px"
            borderColor="gray.700"
            borderRadius="xl"
            p={8}
            textAlign="center"
            color="gray.400"
            bg="gray.800"
          >
            VR 動画が見つかりません。レンダーを選択した状態でアクセスするか、対応する
            <Text as="span" color="teal.300">
              {" *_vr.mp4 "}
            </Text>
            ファイルが
            <Text as="span" color="teal.300">
              {` /public/renders/${setId ?? "{setId}"}/ `}
            </Text>
            に存在することを確認してください。
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default VRViewerPage;

