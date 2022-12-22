import * as React from "react";
import TargetSelector from "./TargetSelector";
import {UseQueryResult} from "@tanstack/react-query";
import {Box, Spinner, useColorMode} from "@chakra-ui/react";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {AgGridReact} from "ag-grid-react";
import {ColDef} from "ag-grid-community";
import {TargetsApiPayload} from "../pages/Home";

import 'ag-grid-community/styles/ag-grid.min.css';
import 'ag-grid-community/styles/ag-theme-alpine.min.css';

type TargetSelectorColumn = {
  nodeName: string;
  cpuUsage: number;
  energyConsumption: number;
}

const fromCpuUsageToEnergyConsumption = (cpuUsage: number) => {
  return (cpuUsage + 1000) * 1.5;
}

type TargetSelectionProps = { targets: UseQueryResult<TargetsApiPayload> }
const TargetSelection = ({targets}: TargetSelectionProps) => {
  const {data: payload, error, isLoading} = targets;

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
      cpuUsage: payload?.targets[key]!, // https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#non-null-assertion-operator-postfix-
      energyConsumption: payload?.targets[key]! + 1000,
    }));
    setRowData(targetRowData);
  }, [payload]);

  const columnDefs: ColDef<TargetSelectorColumn>[] = [
    {
      headerName: 'NODE NAME',
      field: 'nodeName',
      flex: 2,
      sortable: true,
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
      },
      type: 'rightAligned',
      cellStyle: {justifyContent: "flex-end"},
    },
    {
      headerName: 'ENERGY TARGET [W]',
      field: 'energyConsumption',
      flex: 1,
      cellStyle: {justifyContent: "flex-end"},
      sortable: true,
      headerClass: 'header-right',
      resizable: false,
    },
  ];

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      resizable: true,
      suppressMovable: true,
    };
  }, []);

  const {colorMode} = useColorMode();

  if (isLoading) {
    return <Box display="flex" justifyContent="center" alignContent="center"><Spinner size='xl'/></Box>;
  }

  if (error) {
    // TODO: Maybe investigate why error is of type unknown
    // @ts-ignore
    return <Box>Error: {error.message} 😱</Box>;
  }

  return (
    <div className={colorMode === "dark" ? "ag-theme-alpine-dark" : "ag-theme-alpine"} style={{ height: 500, width: "100%" }}>
      <AgGridReact ref={gridRef} rowData={rowData} columnDefs={columnDefs}
                   defaultColDef={defaultColDef}
                   enableCellTextSelection={true} suppressCellFocus={true}
      ></AgGridReact>
    </div>
  );
}

export default TargetSelection;