import {
  Box,
  SimpleGrid,
  Divider,
  Heading,
} from "@chakra-ui/react";
import * as React from "react";
import {createColumnHelper} from "@tanstack/react-table";
import {DataTable} from "components/DataTable";
import TargetSelector from "../components/TargetSelector";

type TargetSelectorColumn = {
  nodeName: string;
  energyConsumption: number;
}

// TODO: Map this to the actual data using https://tanstack.com/query/v4/?from=reactQueryV3&original=https://react-query-v3.tanstack.com/
const data: TargetSelectorColumn[] = [
  {
    nodeName: "host-empa-1",
    energyConsumption: 1000,
  }];

const columnHelper = createColumnHelper<TargetSelectorColumn>();

const columns = [
  columnHelper.accessor("nodeName", {
    id: "nodeName",
    header: "NODE NAME",
    cell: (info) => info.getValue(),
  }),
  columnHelper.display({
    id: 'actions',
    header: "CPU USAGE [%]",
    meta: {
      isNumeric: true,
    },
    cell: props => <TargetSelector row={props.row} />
  }),
  columnHelper.accessor("energyConsumption", {
    cell: (info) => info.getValue(),
    header: "WATTS TARGET [W]",
    meta: {
      isNumeric: true
    }
  })
];

const Home = () =>
  <SimpleGrid columns={2} spacing={5} paddingTop={10} paddingLeft="15px" paddingRight="15px">
    <Box padding="10px">
      <Heading paddingBottom="20px" fontSize="x-large">TARGET SELECTION</Heading>
      <DataTable columns={columns} data={data}/>
    </Box>
    <Box padding="10px" bg='tomato' height='80px'>Line chart</Box>
    <Divider gridColumn="span 2"/>
    <Box padding="10px" bg='tomato' height='80px'>Workloads list</Box>
    <Box padding="10px" bg='tomato' height='80px'>Workload management</Box>
  </SimpleGrid>

export default Home;