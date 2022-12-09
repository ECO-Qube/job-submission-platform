import React, {SetStateAction, useEffect, useState} from "react";
import {AxisOptions, AxisTimeOptions, Chart} from "react-charts";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import {UserSerie} from "react-charts/types/types";
import {Box, Spinner} from "@chakra-ui/react";

type InstantCpuUsage = { timestamp: Date, data: number };

type NodeCpuUsageApiPayload = {
  nodeName: string,
  usage: Array<InstantCpuUsage>,
};

function subtractSeconds(date: Date, seconds: number): Date {
  date.setSeconds(date.getSeconds() - seconds);
  return date;
}

function formatXaxisLabels(value: Date): string {
  let seconds = value?.getSeconds().toString();
  let minutes = value?.getMinutes().toString();
  let hours = value?.getHours().toString();

  if (value?.getSeconds() < 10) {
    seconds = "0" + seconds;
  }
  if (value?.getMinutes() < 10) {
    minutes = "0" + minutes;
  }
  if (value?.getHours() < 10) {
    seconds = "0" + hours;
  }
  return hours + ":" + minutes + ":" + seconds;
}

const TargetChart = () => {
  const [graphData, setGraphData] = useState<UserSerie<InstantCpuUsage>[]>(
    []
  );

  const {data: cpuUsagePayload, error, isLoading} = useQuery(["cpuUsage"], () =>
    axios
      .get("http://localhost:8080/api/v1/actualCpuUsageByRangeSeconds", { params:
          {start: subtractSeconds(new Date(), 10).toISOString(), end: new Date().toISOString()}
      })
      .then((res) => res.data)
  , {refetchInterval: 1000});

  // TODO: Refactor this, i.e. don't repeat same code below (other is in TargetSelection), maybe get targets periodically
  //  from a top-level components and update both TargetSelection and TargetChart (via props or context)
  const {data: targetsPayload} = useQuery(["targets"], () =>
    axios
      .get("http://localhost:8080/api/v1/targets")
      .then((res) =>
        res.data
      )
  );

  const primaryAxis = React.useMemo(
    (): AxisOptions<InstantCpuUsage> => ({
      getValue: cpuUsage => cpuUsage.timestamp,
      tickCount: 10,
      formatters: {
        scale: (value: Date, formatters: AxisTimeOptions<NodeCpuUsageApiPayload>['formatters']) => {
          // keep value? or "cannot infer type" will be thrown by the chart lib
          return formatXaxisLabels(value);
        }
      },
      scaleType: "time"
    }),
    []
  )

  const secondaryAxes = React.useMemo(
    (): AxisOptions<InstantCpuUsage>[] => [
      {
        getValue: cpuUsage => cpuUsage.data,
        hardMin: 0,
        hardMax: 100,
        scaleType: "linear",
      },
    ],
    []
  )

  useEffect(() => {
    if (!cpuUsagePayload) return;

    const newData = cpuUsagePayload.map((currentNodeData: NodeCpuUsageApiPayload) => ({
      label: currentNodeData.nodeName,
      data: cpuUsagePayload.find((u: NodeCpuUsageApiPayload) => u.nodeName == currentNodeData.nodeName)?.usage.map((elem: InstantCpuUsage) => ({
        timestamp: new Date(elem.timestamp),
        data: elem.data
      }))
    }));

    const rulers = Object.entries(targetsPayload.targets).map(([key, value]) => ({
      label: key + "-target",
      data: newData?.find((elem: UserSerie<NodeCpuUsageApiPayload>) => elem.label == key).data?.map((elem2: InstantCpuUsage) => ({
        timestamp: new Date(elem2.timestamp),
        data: value
      }))
    }))
    newData.push(...rulers);

    // TODO: WHY!
    // @ts-ignore
    setGraphData(newData);
  }, [cpuUsagePayload]);

  if (isLoading) {
    return <Box display="flex" justifyContent="center" alignContent="center"><Spinner size='xl'/></Box>;
  }

  if (error) {
    // TODO: Maybe investigate why error is of type unknown
    // @ts-ignore
    return <Box>Error: {error.message} 😱</Box>;
  }

  return (
    <Chart
      options={{
        data: graphData,
        primaryAxis,
        secondaryAxes,
        // defaultColors: ["#ff0000", "#00ffff", "#ff00ff", "#ff0000", "#00ffff", "#ff00ff"], // TODO: How to color code?
      }}
    />
  )
}

export default TargetChart;