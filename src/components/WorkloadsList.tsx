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
  workloadName: string;
  nodeName: string;
  currentState: string;
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
    const workloadRowData: WorkloadsListColumn[] = payload?.workloads.map((workload: any) => ({
      workloadName: workload.name,
      nodeName: workload.nodeName,
      currentState: workload.status,
      submissionDate: workload.submissionDate,
    }));
    setRowData(workloadRowData);
  }, [payload]);

  const [columnDefs] = useState([
    {
      headerName: 'WORKLOAD NAME',
      field: 'workloadName',
      flex: 2,
      sortable: true,
    },
    {
      headerName: 'NODE NAME',
      field: 'nodeName',
      flex: 2,
      sortable: true,
    },
    {
      headerName: 'STATUS',
      field: 'currentState',
      flex: 1,
      sortable: true,
    },
    {
      headerName: 'SUBMISSION DATE',
      field: 'submissionDate',
      flex: 2,
      sortable: true,
      resizable: false,
    },
  ]);

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
    // @ts-ignore
    return <Box>Error: {error.message} 😱</Box>;
  }

  return (
    <div className="ag-theme-alpine-dark" style={{ height: 500, width: "100%" }}>
      <AgGridReact rowData={rowData} columnDefs={columnDefs}
                 defaultColDef={defaultColDef} className={colorMode === "dark" ? "ag-theme-alpine-dark" : "ag-theme-alpine"}
      ></AgGridReact>
    </div>
  );
};

export default WorkloadsList;