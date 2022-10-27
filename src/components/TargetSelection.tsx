import {DataTable, DataTableProps} from "./DataTable";
import * as React from "react";
import {createColumnHelper} from "@tanstack/react-table";
import TargetSelector from "./TargetSelector";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";

type TargetSelectorColumn = {
  nodeName: string;
  energyConsumption: number;
}

// TODO: Map this to the actual data using https://tanstack.com/query/v4/?from=reactQueryV3&original=https://react-query-v3.tanstack.com/
const targetRowData: TargetSelectorColumn[] = [
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

const TargetSelection = () => {
  const { data, error, isLoading } = useQuery(["targets"], () =>
    axios
      .get("http://localhost:8080/api/v1/targets")
      .then((res) => res.data));

  return <DataTable data={targetRowData} columns={columns} />;
}

export default TargetSelection;