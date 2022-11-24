import { HStack, VStack } from "@chakra-ui/react";
import { Navbar } from "./components/Navbar";
import { PanelLeft } from "./components/PanelLeft";
import { PanelRight } from "./components/PanelRight";

export const App: React.FC = () => {
  return (
    <VStack align="stretch" >
      <Navbar />
      <HStack>
        <PanelLeft />
        <PanelRight />
      </HStack>
    </VStack>
  );
};
