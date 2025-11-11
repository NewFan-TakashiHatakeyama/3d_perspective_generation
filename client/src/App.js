import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import RenderingDemoPage from "./components/rendering-demo/RenderingDemoPage";
import SetupPage from "./components/setup/SetupPage";
import VRViewerPage from "./components/rendering-demo/VRViewerPage";

const App = () => (
  <ChakraProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SetupPage />} />
        <Route path="/preview" element={<RenderingDemoPage />} />
        <Route path="/preview/vr" element={<VRViewerPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </ChakraProvider>
);

export default App;