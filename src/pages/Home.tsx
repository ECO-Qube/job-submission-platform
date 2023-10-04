import {
  Box,
  SimpleGrid,
  Heading,
} from "@chakra-ui/react";
import * as React from "react";
import TargetSelection from "../components/TargetSelection";
import WorkloadsList from "../components/WorkloadsList";
import WorkloadsGeneration from "../components/WorkloadGeneration";
import TargetChart from "../components/TargetChart";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import {RequestHelper} from "../components/RequestHelper";

export interface TargetsApiPayload {
  targets: Record<string, number>
}

export interface WorkloadApiPayload {
  workloads: Array<any> // TODO: define type
}

const Home = () => {
  const targets = useQuery<TargetsApiPayload>(["targets"], () =>
    axios
      .get(process.env.REACT_APP_TARGET_EXPORTER_URL+'/api/v1/targets')
      .then((res) =>
        res.data
      )
  , { refetchInterval: 1000 });
  const workloads = useQuery<WorkloadApiPayload>(["workloads"], () =>
    axios
        .get(process.env.REACT_APP_TARGET_EXPORTER_URL+'/api/v1/workloads')
        .then((res) =>
            res.data
        ),
{ refetchInterval: 1000 });

  return (<SimpleGrid spacingY="30px" columns={2} spacing={5} paddingTop={10} paddingBottom={10} paddingLeft="15px" paddingRight="15px">
    <Box padding="10px">
      <Heading marginBottom="30px" fontSize="x-large">TARGET SELECTION</Heading>
      {/*<TargetSelection targets={ref.current}/>*/}
      <RequestHelper isLoading={targets.isLoading} error={targets.error}>
        <TargetSelection targets={targets.data} />
      </RequestHelper>
    </Box>
    <Box padding="10px" overflow="auto">
      <Heading marginBottom="30px" fontSize="x-large">CPU USAGE / TARGETS</Heading>
      <RequestHelper isLoading={targets.isLoading} error={targets.error}>
        <TargetChart targets={targets.data} />
      </RequestHelper>
    </Box>
    <Box padding="10px" gridColumn="1 / 3">
      <Heading marginBottom="30px" fontSize="x-large">WORKLOADS LIST</Heading>
      <RequestHelper isLoading={workloads.isLoading} error={workloads.error}>
        <WorkloadsList workloads={workloads.data} />
      </RequestHelper>
    </Box>
    <Box padding="10px">
      <Heading marginBottom="30px" fontSize="x-large">WORKLOADS GENERATION</Heading>
      <WorkloadsGeneration/>
    </Box>
  </SimpleGrid>)
}

export default Home;