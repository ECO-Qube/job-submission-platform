import {DataTable, DataTableProps} from "./DataTable";
import * as React from "react";
import {createColumnHelper, RowData} from "@tanstack/react-table";
import TargetSelector from "./TargetSelector";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import {Box, Spinner} from "@chakra-ui/react";
import {useCallback, useEffect, useState} from "react";

type TargetSelectorColumn = {
  nodeName: string;
  cpuUsage: number;
  energyConsumption: number;
}

const columnHelper = createColumnHelper<TargetSelectorColumn>();

const TargetSelection = () => {
  const {data: payload, error, isLoading} = useQuery(["targets"], () =>
    axios
      .get("http://localhost:8080/api/v1/targets")
      .then((res) =>
        res.data
      )
  );

  const [rowData, setRowData] = useState<TargetSelectorColumn[]>([]);
  // TODO: Extract away
  useEffect(() => {
    if (!payload) return;
    const targetRowData: TargetSelectorColumn[] = Object.keys(payload?.targets).map((key) => ({
      nodeName: key,
      cpuUsage: payload?.targets[key],
      energyConsumption: payload?.targets[key] + 1000,
    }));
    setRowData(targetRowData);
  }, [payload]);

  if (isLoading) {
    return <Box display="flex" justifyContent="center" alignContent="center"><Spinner size='xl'/></Box>;
  }

  if (error) {
    // TODO: Maybe investigate why error is of type unknown
    // @ts-ignore
    return <Box>Error: {error.message} 😱</Box>;
  }

  function updateTarget(newTarget: number, targetIndex: number) {
    setRowData((prevRowData) => {
      return prevRowData.map((data, index) => {
        if (index === targetIndex) {
          return {
            ...data,
            cpuUsage: newTarget,
            energyConsumption: newTarget + 1000,
          }
        }
        return data;
      });
    });
  }

  const columns = [
    columnHelper.accessor("nodeName", {
      id: "nodeName",
      header: "NODE NAME",
      meta: {
        width: "20vw"
      },
      cell: (info) => info.getValue(),
    }),
    columnHelper.display( {
      id: 'cpuUsage',
      header: "CPU USAGE [%]",
      meta: {
        isNumeric: true
      },
      cell: (props) => <TargetSelector nodeName={props.row.original.nodeName}
                                       initialValue={props.row.original.cpuUsage}
                                       onChange={(value: number) => updateTarget(value, props.row.index)}/>

      // React.useCallback((value: number) => updateTarget(value, props.row.index), [false])
      // input will rerender due to changeRow passed as a property, useCallback avoids this. Wrap function in useCallback
      // and say it depends on this property, only trigger if prop changed
    }),
    columnHelper.accessor("energyConsumption", {
      // https://github.com/TanStack/table/discussions/4205#discussioncomment-3206311
      cell: (info) => info.getValue(),
      header: "WATTS TARGET [W]",
      meta: {
        isNumeric: true
      },
      id: "energyConsumption"
    })
  ];

  return <DataTable data={rowData} columns={columns}/>;
}

export default TargetSelection;