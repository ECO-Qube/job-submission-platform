import {
  Box,
  SimpleGrid,
  Divider,
  Heading,
} from "@chakra-ui/react";
import * as React from "react";
import {DataTable} from "components/DataTable";
import TargetSelection from "../components/TargetSelection";

const Home = () =>
  <SimpleGrid columns={2} spacing={5} paddingTop={10} paddingLeft="15px" paddingRight="15px">
    <Box padding="10px">
      <Heading paddingBottom="20px" fontSize="x-large">TARGET SELECTION</Heading>
      <TargetSelection />
    </Box>
    <Box padding="10px" bg='tomato' height='80px'>Line chart</Box>
    <Divider gridColumn="span 2"/>
    <Box padding="10px" bg='tomato' height='80px'>Workloads list</Box>
    <Box padding="10px" bg='tomato' height='80px'>Workload management</Box>
  </SimpleGrid>

export default Home;