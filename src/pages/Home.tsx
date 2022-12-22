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
import TargetChart from "../components/TargetChart";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";

export interface TargetsApiPayload {
  targets: Record<string, number>
}

const Home = () => {
  const targets = useQuery<TargetsApiPayload>(["targets"], () =>
    axios
      .get("http://localhost:8080/api/v1/targets")
      .then((res) =>
        res.data
      )
  , { refetchInterval: 1000 });

  return (<SimpleGrid spacingY="30px" columns={2} spacing={5} paddingTop={10} paddingBottom={10} paddingLeft="15px" paddingRight="15px">
    <Box padding="10px">
      <Heading marginBottom="30px" fontSize="x-large">TARGET SELECTION</Heading>
      <TargetSelection targets={targets}/>
    </Box>
    <Box padding="10px" overflow="auto">
      <Heading marginBottom="30px" fontSize="x-large">CPU USAGE / TARGETS</Heading>
      <TargetChart />
    </Box>
    <Box padding="10px">
      <Heading marginBottom="30px" fontSize="x-large">WORKLOADS LIST</Heading>
      <WorkloadsList/>
    </Box>
    <Box padding="10px">
      <Heading marginBottom="30px" fontSize="x-large">WORKLOADS GENERATION</Heading>
      <WorkloadsGeneration/>
    </Box>
  </SimpleGrid>)
}

export default Home;