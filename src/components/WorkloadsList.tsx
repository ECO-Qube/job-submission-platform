import * as React from "react";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import {Box, Spinner, useColorMode} from "@chakra-ui/react";

import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/styles/ag-grid.min.css';
import 'ag-grid-community/styles/ag-theme-alpine.min.css';

import {ColDef} from "ag-grid-community";
import {WorkloadApiPayload} from "../pages/Home";
import TargetSelector from "./TargetSelector";
import LimitSelector from "./LimitSelector";

type WorkloadsListColumn = {
  editing: boolean;
  name: string;
  nodeName: string;
  status: string;
  submissionDate: string;
  cpuTarget: number;
  energyConsumption: number;
}

const fromCpuUsageToEnergyConsumption = (cpuUsage: number) => {
  return (cpuUsage + 1000) * 1.5;
}

type WorkloadListProps = { workloads: WorkloadApiPayload | undefined }
const WorkloadsList = ({workloads}: WorkloadListProps) => {
  const gridRef = useRef<AgGridReact>(null);
  const [rowData, setRowData] = useState<WorkloadsListColumn[]>(generateRowData(workloads!));

  useEffect(() => {
    if (!workloads) return;
    setRowData(generateRowData(workloads!));
  }, [workloads]);

  const setNewEnergyConsumption = useCallback((limit: string, rowIndex: number) => {
    const currentRowData = rowData[rowIndex];
    if (!currentRowData) return; // todo: catch null
    currentRowData.energyConsumption = fromCpuUsageToEnergyConsumption(Number(limit)); // todo: catch null
    currentRowData.cpuTarget = Number(limit); // todo: catch null
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

  function generateRowData(workloads: WorkloadApiPayload): WorkloadsListColumn[] {
    return workloads?.workloads.map((workload: WorkloadsListColumn) => ({
      editing: false,
      name: workload.name,
      nodeName: workload.nodeName,
      status: workload.status,
      submissionDate: workload.submissionDate.replace(/ \+.*/, ''),
      cpuTarget: workload.cpuTarget, // TODO: Refactor name, either call it cpuLimit or cpuTarget or something else
      energyConsumption: 1000,
    }));
  }

  const columnDefs: ColDef<WorkloadsListColumn>[] = [
    {
      headerName: 'WORKLOAD NAME',
      field: 'name',
    },
    {
      headerName: 'NODE NAME',
      field: 'nodeName',
    },
    {
      headerName: 'STATUS',
      field: 'status',
      flex: 1,
    },
    {
      headerName: 'SUBMISSION DATE',
      field: 'submissionDate',
      type: 'rightAligned',
      headerClass: 'right-aligned-header',
      flex: 1,
    },
    {
      headerName: 'CPU LIMIT [%]',
      field: 'limit',
      flex: 1,
      cellStyle: {display: 'flex', justifyContent: 'end'},
      type: 'rightAligned',
      cellRenderer: (params: any) => {
        return <LimitSelector  workloadName={params.data.name}
                               value={params.data.cpuTarget}
                               onValueChange={(value: string) => setNewEnergyConsumption(value, params.rowIndex)}
                               onEditChange={(value: boolean) => setEditing(value, params.rowIndex)}
                               editing={params.data.editing}
        />;
      },
    },
    // {
    //   headerName: 'EST. ENERGY CONS. [W]',
    //   field: 'energyConsumption',
    //   resizable: false,
    //   type: 'rightAligned',
    //   headerClass: 'right-aligned-header',
    //   flex: 1,
    // },
  ];

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      resizable: true,
      suppressMovable: true,
      sortable: true,
      flex: 2,
    };
  }, []);

  const {colorMode} = useColorMode();

  return (
    <div className={colorMode === "dark" ? "ag-theme-alpine-dark" : "ag-theme-alpine"} style={{ height: 500, width: "100%" }}>
      <AgGridReact ref={gridRef} rowData={rowData} columnDefs={columnDefs}
                   defaultColDef={defaultColDef} className="border-radius"
                   enableCellTextSelection={true} suppressCellFocus={true}
      ></AgGridReact>
    </div>
  );
};

export default WorkloadsList;