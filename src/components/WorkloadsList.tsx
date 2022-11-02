import {DataTable, DataTableProps} from "./DataTable";
import * as React from "react";
import {createColumnHelper, RowData} from "@tanstack/react-table";
import {useCallback, useEffect, useState} from "react";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import {Box, Spinner} from "@chakra-ui/react";

type WorkloadsListColumn = {
  workloadName: string;
  nodeName: string;
  currentState: string;
  submissionDate: string;
}

const columnHelper = createColumnHelper<WorkloadsListColumn>();

const WorkloadsList = () => {
  const {data: payload, error, isLoading} = useQuery(["workloads"], () =>
    axios
      .get("http://localhost:8080/api/v1/workloads")
      .then((res) =>
        res.data
      )
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

  if (isLoading) {
    return <Box display="flex" justifyContent="center" alignContent="center"><Spinner size='xl'/></Box>;
  }

  if (error) {
    // @ts-ignore
    return <Box>Error: {error.message} 😱</Box>;
  }

  const workloadList: WorkloadsListColumn[] = [{
    workloadName: "stress-test-123",
    nodeName: "scheduling-dev-wkld-md-0-4kb8j",
    currentState: "Pending",
    submissionDate: "02/10/2022 14:00"
  },
  {
    workloadName: "hpc-job-5120def",
    nodeName: "scheduling-dev-wkld-md-0-9tnbl",
    currentState: "Deleting",
    submissionDate: "02/10/2022 15:00"
  }];

  const columns = [
    columnHelper.accessor("workloadName",{
      id: "workloadName",
      header: "WORKLOAD NAME",
      meta: {
        width: "15vw",
      },
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("nodeName",{
      id: "nodeName",
      header: "NODE NAME",
      meta: {
        width: "15vw",
      },
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("currentState", {
      id: "currentState",
      header: "CURRENT STATE",
      meta: {
        isNumeric: true
      },
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("submissionDate", {
      id: "submissionDate",
      header: "SUBMISSION DATE",
      meta: {
        isNumeric: true,
      },
      cell: (info) => info.getValue(),
    }),
    // columnHelper.display({
    //   id: 'actions',
    //   header: "CPU USAGE [%]",
    //   meta: {
    //     isNumeric: true,
    //   },
    //   cell: (props) => <TargetSelector nodeName={props.row.original.nodeName}
    //                                    initialValue={props.row.original.cpuUsage}
    //                                    onChange={(value: number) => changeRow(value, props.row.index)}/>
    //   // input will rerender due to changeRow passed as a property, useCallback avoids this. Wrap function in useCallback
    //   // and say it depends on this property, only trigger if prop changed
    // }),
    // columnHelper.accessor("energyConsumption", {
    //   // https://github.com/TanStack/table/discussions/4205#discussioncomment-3206311
    //   cell: (info) => info.getValue(),
    //   header: "WATTS TARGET [W]",
    //   meta: {
    //     isNumeric: true
    //   },
    // })
  ];

  return <DataTable data={rowData} columns={columns}/>;
}

export default WorkloadsList;