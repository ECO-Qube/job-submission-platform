import {Box, Grid, VStack, Text, Code, Link, SimpleGrid, Divider, Heading} from "@chakra-ui/react";
import {Logo} from "Logo";
import Navbar from "components/Navbar";
import * as React from "react";
import {ChakraProvider} from "@chakra-ui/react";
import {createColumnHelper} from "@tanstack/react-table";
import {DataTable} from "components/DataTable";

type UnitConversion = {
  fromUnit: string;
  toUnit: string;
  factor: number;
};

const data: UnitConversion[] = [
  {
    fromUnit: "inches",
    toUnit: "millimetres (mm)",
    factor: 25.4
  },
  {
    fromUnit: "feet",
    toUnit: "centimetres (cm)",
    factor: 30.48
  },
  {
    fromUnit: "yards",
    toUnit: "metres (m)",
    factor: 0.91444
  },
];

const columnHelper = createColumnHelper<UnitConversion>();

const columns = [
  columnHelper.accessor("fromUnit", {
    cell: (info) => info.getValue(),
    header: "To convert"
  }),
  columnHelper.accessor("toUnit", {
    cell: (info) => info.getValue(),
    header: "Into"
  }),
  columnHelper.accessor("factor", {
    cell: (info) => info.getValue(),
    header: "Multiply by",
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