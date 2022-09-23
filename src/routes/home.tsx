import {
  SimpleGrid,
} from "@chakra-ui/react";
import { Header } from "/@/components/Header";
import { MetaframeOutputsRaw } from '/@/components/MetaframeOutputsRaw';

export const Route: React.FC = () => (
  <SimpleGrid columns={1} spacing={10}>
    <Header />
    <MetaframeOutputsRaw />
  </SimpleGrid>
);
