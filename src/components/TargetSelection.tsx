import {DataTable, DataTableProps} from "./DataTable";
import * as React from "react";
import {createColumnHelper} from "@tanstack/react-table";
import TargetSelector from "./TargetSelector";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import {Box, Spinner} from "@chakra-ui/react";

type TargetSelectorColumn = {
  nodeName: string;
  energyConsumption: number;
}

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
    cell: (props) => <TargetSelector currentValue={props.row.original.energyConsumption} />
  }),
  columnHelper.accessor("energyConsumption", {
    cell: (info) => info.getValue() * 25 + 1000,
    header: "WATTS TARGET [W]",
    meta: {
      isNumeric: true
    }
  })
];

const TargetSelection = () => {
  // TODO: Wrap in useEffect
  const {data, error, isLoading} = useQuery(["targets"], () =>
    axios
      .get("http://localhost:8080/api/v1/targets")
      .then((res) =>
        res.data
      )
  );

  if (isLoading) {
    return <Box display="flex" justifyContent="center" alignContent="center"><Spinner size='xl'/></Box>;
  }

  if (error) {
    console.log(error);
    // TODO: Maybe investigate why error is of type unknown
    // @ts-ignore
    return <Box>Error: {error.message} 😱</Box>;
  }

  const targetRowData: TargetSelectorColumn[] = Object.keys(data?.targets).map((key) => ({
    nodeName: key,
    energyConsumption: data?.targets[key]
  }));

  return <DataTable data={targetRowData} columns={columns}/>;
}

export default TargetSelection;