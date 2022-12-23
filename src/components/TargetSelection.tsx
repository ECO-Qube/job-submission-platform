import * as React from "react";
import TargetSelector from "./TargetSelector";
import {useColorMode} from "@chakra-ui/react";
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

type TargetSelectionProps = { targets: TargetsApiPayload | undefined }
const TargetSelection = ({targets}: TargetSelectionProps) => {
  const gridRef = useRef<AgGridReact>(null);

  const setNewEnergyConsumption = useCallback((value: string, rowId: string) => {
    let rowNode = gridRef.current!.api.getRowNode(rowId)!;
    let newEnergyConsumption = fromCpuUsageToEnergyConsumption(Number(value));
    rowNode.setDataValue('energyConsumption', newEnergyConsumption);
  }, []);

  const [rowData, setRowData] = useState<TargetSelectorColumn[]>([]);
  // // TODO: Extract away
  useEffect(() => {
    if (!targets) return;
    const targetRowData: TargetSelectorColumn[] = Object.keys(targets?.targets).map((key) => ({
      nodeName: key,
      cpuUsage: targets?.targets[key]!, // https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#non-null-assertion-operator-postfix-
      energyConsumption: targets?.targets[key]! + 1000,
    }));
    setRowData(targetRowData);
  }, [targets]);

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
        // put the value in bold
        return <TargetSelector nodeName={params.data.nodeName}
                               initialValue={params.data.cpuUsage}
                               onChange={(value: string) => setNewEnergyConsumption(value, params.rowIndex)}/>;
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

  return (
    <div className={colorMode === "dark" ? "ag-theme-alpine-dark" : "ag-theme-alpine"} style={{ height: 500, width: "100%" }}>
      <AgGridReact ref={gridRef} rowData={rowData} columnDefs={columnDefs}
                   defaultColDef={defaultColDef}
                   enableCellTextSelection={true} suppressCellFocus={true} className="border-radius"
      ></AgGridReact>
    </div>
  );
}

export default TargetSelection;