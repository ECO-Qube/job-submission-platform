import {DataTable} from "./DataTable";
import * as React from "react";
import {createColumnHelper, RowData} from "@tanstack/react-table";
import TargetSelector from "./TargetSelector";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import {Box, Spinner} from "@chakra-ui/react";
import {FC, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {AgGridReact} from "ag-grid-react";
import {ColDef} from "ag-grid-community";

type TargetSelectorColumn = {
  nodeName: string;
  cpuUsage: object;
  energyConsumption: number;
}

const fromCpuUsageToEnergyConsumption = (cpuUsage: number) => {
  return cpuUsage * 2.5 + 1000;
}

const TargetSelection = () => {
  const {data: payload, error, isLoading} = useQuery(["targets"], () =>
    axios
      .get("http://localhost:8080/api/v1/targets")
      .then((res) =>
        res.data
      )
  );

  const gridRef = useRef<AgGridReact>(null);

  const setNewEnergyConsumption = useCallback((value: string, rowId: string) => {
    let rowNode = gridRef.current!.api.getRowNode(rowId)!;
    let newEnergyConsumption = fromCpuUsageToEnergyConsumption(Number(value));
    rowNode.setDataValue('energyConsumption', newEnergyConsumption);
  }, []);

  const [rowData, setRowData] = useState<TargetSelectorColumn[]>([]);
  // // TODO: Extract away
  useEffect(() => {
    if (!payload) return;
    const targetRowData: TargetSelectorColumn[] = Object.keys(payload?.targets).map((key) => ({
      nodeName: key,
      cpuUsage: payload?.targets[key],
      energyConsumption: payload?.targets[key] + 1000,
    }));
    setRowData(targetRowData);
  }, [payload]);

  const columnDefs: ColDef<TargetSelectorColumn>[] = [
    {
      headerName: 'NODE NAME',
      field: 'nodeName',
      flex: 2,
    },
    {
      headerName: 'CPU TARGET [%]',
      field: 'cpuUsage',
      flex: 1,
      cellRenderer: (params: any) => {
        // put the value in bold
        return <TargetSelector nodeName={params.data.nodeName}
                               initialValue={params.data.cpuUsage}
                               onChange={(value: string) => setNewEnergyConsumption(value, params.rowIndex)}/>;
      }
    },
    {
      headerName: 'ENERGY TARGET [W]',
      field: 'energyConsumption',
      flex: 1,
    },
  ];

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      resizable: true,
    };
  }, []);

  if (isLoading) {
    return <Box display="flex" justifyContent="center" alignContent="center"><Spinner size='xl'/></Box>;
  }

  if (error) {
    // TODO: Maybe investigate why error is of type unknown
    // @ts-ignore
    return <Box>Error: {error.message} 😱</Box>;
  }

  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
      <AgGridReact ref={gridRef} rowData={rowData} columnDefs={columnDefs}
                   defaultColDef={defaultColDef}
      ></AgGridReact>
    </div>
  );
}

export default TargetSelection;