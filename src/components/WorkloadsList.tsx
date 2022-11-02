import {DataTable, DataTableProps} from "./DataTable";
import * as React from "react";
import {createColumnHelper, RowData} from "@tanstack/react-table";
import {useCallback, useEffect, useState} from "react";

type WorkloadsListColumn = {
  nodeName: string;
  currentState: string;
  submissionDate: string;
}

const columnHelper = createColumnHelper<WorkloadsListColumn>();

const WorkloadsList = () => {
  useEffect(() => {

    });
  // const {data, error, isLoading} = useQuery(["targets"], () =>
  //   axios
  //     .get("http://localhost:8080/api/v1/targets")
  //     .then((res) =>
  //       res.data
  //     )
  // );
  //
  // if (isLoading) {
  //   return <Box display="flex" justifyContent="center" alignContent="center"><Spinner size='xl'/></Box>;
  // }
  //
  // if (error) {
  //   console.log(error);
  //   // TODO: Maybe investigate why error is of type unknown
  //   // @ts-ignore
  //   return <Box>Error: {error.message} 😱</Box>;
  // }

  // const workloadList: WorkloadsListColumn[] = Object.keys(data?.targets).map((key) => ({
  //   nodeName: key,
  //   currentState: data?.targets[key],
  //   submissionDate: data?.targets[key] + 1000,
  // }));

  const workloadList: WorkloadsListColumn[] = [{
    nodeName: "stress-test-123",
    currentState: "Pending",
    submissionDate: "02/10/2022 14:00"
  },
  {
    nodeName: "hpc-job-5120def",
    currentState: "Deleting",
    submissionDate: "02/10/2022 15:00"
  }];

  const columns = [
    columnHelper.accessor("nodeName",{
      id: "nodeName",
      header: "NODE NAME",
      meta: {
        width: "20vw"
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
        isNumeric: true
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

  return <DataTable data={workloadList} columns={columns}/>;
}

export default WorkloadsList;