import * as React from "react";
import TargetSelector from "./TargetSelector";
import {Box, Text, useColorMode} from "@chakra-ui/react";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {AgGridReact} from "ag-grid-react";
import {ColDef} from "ag-grid-community";
import {TargetsApiPayload} from "../pages/Home";

import 'ag-grid-community/styles/ag-grid.min.css';
import 'ag-grid-community/styles/ag-theme-alpine.min.css';

type TargetSelectorColumn = {
  editing: boolean;
  nodeName: string;
  cpuUsage: number;
  energyConsumption: number;
}

const fromCpuUsageToEnergyConsumption = (cpuUsage: number) => {
  return (cpuUsage + 1000) * 1.5;
}

type TargetSelectionProps = { targets: TargetsApiPayload | undefined }
const TargetSelection = ({targets}: TargetSelectionProps) => {
  const gridRef = useRef<AgGridReact>(null);
  const [rowData, setRowData] = useState<TargetSelectorColumn[]>(generateRowData(targets!));

  const setNewEnergyConsumption = useCallback((cpuUsage: string, rowIndex: number) => {
    const currentRowData = rowData[rowIndex];
    if (!currentRowData) return; // todo: catch null
    currentRowData.energyConsumption = fromCpuUsageToEnergyConsumption(Number(cpuUsage)); // todo: catch null
    currentRowData.cpuUsage = Number(cpuUsage); // todo: catch null
    const updatedRowData = [...rowData];
    updatedRowData[rowIndex] = currentRowData;

    setRowData(updatedRowData);
  }, [setRowData, fromCpuUsageToEnergyConsumption, rowData]);

  const setEditing = useCallback((editing: boolean, rowIndex: number) => {
    const currentRowData = rowData[rowIndex];
    if (!currentRowData) return; // todo: catch null
    currentRowData.editing = editing;
    const updatedRowData = [...rowData];
    updatedRowData[rowIndex] = currentRowData;

    setRowData(updatedRowData);
  }, [setRowData, rowData]);


  function generateRowData(targets: TargetsApiPayload): TargetSelectorColumn[] {
    const targetRowData: TargetSelectorColumn[] = Object.keys(targets?.targets).map((key) => ({
      nodeName: key,
      cpuUsage: targets?.targets[key]!, // https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#non-null-assertion-operator-postfix-
      energyConsumption: targets?.targets[key]! + 1000,
      editing: false,
    }));
    return targetRowData;
  }

  const columnDefs: ColDef<TargetSelectorColumn>[] = [
    {
      headerName: 'NODE NAME',
      field: 'nodeName',
      sortable: true,
      flex: 2,
    },
    {
      headerName: 'CPU TARGET [%]',
      field: 'cpuUsage',
      cellRenderer: (params: any) => {
        return <TargetSelector nodeName={params.data.nodeName}
                               value={params.data.cpuUsage}
                               onValueChange={(value: string) => setNewEnergyConsumption(value, params.rowIndex)}
                               onEditChange={(value: boolean) => setEditing(value, params.rowIndex)}
                               editing={params.data.editing}
        />;
      },
      type: 'rightAligned',
      cellStyle: {display: 'flex', justifyContent: 'end'},
    },
    {
      headerName: 'ENERGY TARGET [W]',
      field: 'energyConsumption',
      sortable: true,
      resizable: false,
      type: 'rightAligned',
      headerClass: 'right-aligned-header',
    },
  ];

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      resizable: true,
      suppressMovable: true,
      flex: 1,
    };
  }, []);

  const {colorMode} = useColorMode();

  function getTotalEnergyTarget() {
    return rowData.reduce((acc, curr) => acc + curr.energyConsumption, 0);
  }

  return (
    <div className={colorMode === "dark" ? "ag-theme-alpine-dark" : "ag-theme-alpine"} style={{ height: 500, width: "100%" }}>
      <AgGridReact ref={gridRef} rowData={rowData} columnDefs={columnDefs}
                   defaultColDef={defaultColDef}
                   enableCellTextSelection={true} suppressCellFocus={true} className="border-radius"
      ></AgGridReact>
      <Box paddingBlock="10px"><Text>Total energy target: {getTotalEnergyTarget()} W</Text></Box>
    </div>
  );
}

export default TargetSelection;