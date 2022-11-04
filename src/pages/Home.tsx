import {
  Box,
  SimpleGrid,
  Divider,
  Heading,
} from "@chakra-ui/react";
import * as React from "react";
import TargetSelection from "../components/TargetSelection";
import WorkloadsList from "../components/WorkloadsList";
import WorkloadsGeneration from "../components/WorkloadGeneration";

const Home = () =>
  <SimpleGrid columns={2} spacing={5} paddingTop={10} paddingLeft="15px" paddingRight="15px">
    <Box padding="10px">
      <Heading paddingBottom="20px" fontSize="x-large">TARGET SELECTION</Heading>
      <TargetSelection/>
    </Box>
    <Box padding="10px" height='80px'>Line chart (WIP)</Box>
    <Divider gridColumn="span 2"/>
    <Box padding="10px">
      <Heading paddingBottom="20px" fontSize="x-large">WORKLOADS LIST</Heading>
      <WorkloadsList/>
    </Box>
    <Box padding="10px">
      <Heading paddingBottom="20px" fontSize="x-large">WORKLOADS GENERATION</Heading>
      <WorkloadsGeneration />
    </Box>
  </SimpleGrid>

export default Home;