import React, {SetStateAction, useEffect, useState} from "react";
import {AxisOptions, Chart} from "react-charts";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import {useInterval} from "@chakra-ui/react";
import {UserSerie} from "react-charts/types/types";

type NodeCpuUsage = { timestamp: Date, value: number };
type NodeCpuUsageApiPayload = {nodeName: string, timestamp: string, usage: number};

function subtractSeconds(date: Date, seconds: number): Date {
  // TODO: Change to setSeconds
  date.setSeconds(date.getSeconds() - seconds);

  return date;
}

const TargetChart = () => {
  const [isGraphDefined, setGraphDefined] = useState(false);

  const [graphData, setGraphData] = useState<UserSerie<NodeCpuUsage>[]>(
    [
      {
        label: 'node1',
        // TODO: Why do I get a type error if the initial array is empty?
        // data: Array<NodeCpuUsage>(),
        data: [...Array(10).keys()].map(i => ({timestamp: subtractSeconds(new Date(), i), value: 0})),
      }
    ]
  );

  const {data: payload, error, isLoading} = useQuery(["cpuUsage"], () =>
    axios
      .get("http://localhost:8080/api/v1/actualNodeCpuUsage")
      .then((res) => res.data)
  , {refetchInterval: 1000});

  const primaryAxis = React.useMemo(
    (): AxisOptions<NodeCpuUsage> => ({
      getValue: cpuUsage => cpuUsage.timestamp,
      tickCount: 10,
    }),
    []
  )

  const secondaryAxes = React.useMemo(
    (): AxisOptions<NodeCpuUsage>[] => [
      {
        getValue: cpuUsage => cpuUsage.value,
        hardMin: 0,
        hardMax: 10
      },
    ],
    []
  )

  useEffect(() => {
    if (!payload) return;

    let newData: UserSerie<NodeCpuUsage> | null = null;
    if (!isGraphDefined) {
      // If graph was never defined before, create 10 datapoints set to 0
      newData = payload.map((nodeCpuUsage: NodeCpuUsageApiPayload) => ({
        label: nodeCpuUsage.nodeName,
        data: [...Array(10).keys()].map(i => ({timestamp: subtractSeconds(new Date(nodeCpuUsage.timestamp), i), value: 0}))
      }))

      setGraphDefined(true);
    } else {
      // TODO: Fix this
      newData = payload.map((nodeCpuUsage: NodeCpuUsageApiPayload) => ({
        label: nodeCpuUsage.nodeName,
        data:  graphData.find(u => u.label == nodeCpuUsage.nodeName)?.data.slice(1).concat({
          timestamp: new Date(nodeCpuUsage.timestamp),
          value: nodeCpuUsage.usage
        })}));
    }

    // TODO: WHY!
    // @ts-ignore
    setGraphData(newData);
  }, [payload]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <Chart
      options={{
        data: graphData,
        primaryAxis,
        secondaryAxes,
      }}
    />
  )
}

export default TargetChart;