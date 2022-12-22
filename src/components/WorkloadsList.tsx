import * as React from "react";
import {useEffect, useMemo, useState} from "react";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import {Box, Spinner, useColorMode} from "@chakra-ui/react";

import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/styles/ag-grid.min.css';
import 'ag-grid-community/styles/ag-theme-alpine.min.css';

import {ColDef} from "ag-grid-community";

type WorkloadsListColumn = {
  name: string;
  nodeName: string;
  status: string;
  submissionDate: string;
}

const WorkloadsList = () => {
  const {data: payload, error, isLoading} = useQuery(["workloads"], () =>
    axios
      .get("http://localhost:8080/api/v1/workloads")
      .then((res) =>
        res.data
      ),
    {
      refetchInterval: 1000,
    }
  );

  const [rowData, setRowData] = useState<WorkloadsListColumn[]>([]);

  useEffect(() => {
    if (!payload) return;
    const workloadRowData: WorkloadsListColumn[] = payload?.workloads.map((workload: WorkloadsListColumn) => ({
      workloadName: workload.name,
      nodeName: workload.nodeName,
      currentState: workload.status,
      submissionDate: workload.submissionDate.replace(/ \+0100.*/, ''),
    }));
    setRowData(workloadRowData);
  }, [payload]);

  const [columnDefs] = useState([
    {
      headerName: 'WORKLOAD NAME',
      field: 'workloadName',
      sortable: true,
      flex: 3,
    },
    {
      headerName: 'NODE NAME',
      field: 'nodeName',
      sortable: true,
      flex: 2,

    },
    {
      headerName: 'STATUS',
      field: 'currentState',
      sortable: true,
    },
    {
      headerName: 'SUBMISSION DATE',
      field: 'submissionDate',
      sortable: true,
      resizable: false,
      flex: 2,
      type: 'rightAligned',
    },
  ]);

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      resizable: true,
      suppressMovable: true,
      flex: 1,
    };
  }, []);

  const {colorMode} = useColorMode();

  if (isLoading) {
    return <Box display="flex" justifyContent="center" alignContent="center"><Spinner size='xl'/></Box>;
  }

  if (error) {
    // @ts-ignore
    return <Box>Error: {error.message} 😱</Box>;
  }

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