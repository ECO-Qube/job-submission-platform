import * as React from "react";
import {useEffect, useMemo, useState} from "react";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import {Box, Spinner, useColorMode} from "@chakra-ui/react";

import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/styles/ag-grid.min.css';
import 'ag-grid-community/styles/ag-theme-alpine.min.css';

import {ColDef} from "ag-grid-community";
import {WorkloadApiPayload} from "../pages/Home";

type WorkloadsListColumn = {
  name: string;
  nodeName: string;
  status: string;
  submissionDate: string;
  limit: number;
  energyConsumption: number;
}

type WorkloadListProps = { workloads: WorkloadApiPayload | undefined }
const WorkloadsList = ({workloads}: WorkloadListProps) => {
  const [rowData, setRowData] = useState<WorkloadsListColumn[]>(generateRowData(workloads!));

  function generateRowData(workloads: WorkloadApiPayload): WorkloadsListColumn[] {
    return workloads?.workloads.map((workload: WorkloadsListColumn) => ({
      name: workload.name,
      nodeName: workload.nodeName,
      status: workload.status,
      submissionDate: workload.submissionDate.replace(/ \+.*/, ''),
      limit: 5,
      energyConsumption: 1000,
    }));
  }

  const [columnDefs] = useState([
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
      headerName: 'LIMIT',
      field: 'limit',
      type: 'rightAligned',
      headerClass: 'right-aligned-header',
      flex: 1,
    },
    {
      headerName: 'EST. ENERGY CONS. [W]',
      field: 'energyConsumption',
      resizable: false,
      type: 'rightAligned',
      headerClass: 'right-aligned-header',
      flex: 1,
    },
  ]);

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
      <AgGridReact rowData={rowData} columnDefs={columnDefs}
                   defaultColDef={defaultColDef} className="border-radius"
                   enableCellTextSelection={true} suppressCellFocus={true}
      ></AgGridReact>
    </div>
  );
};

export default WorkloadsList;