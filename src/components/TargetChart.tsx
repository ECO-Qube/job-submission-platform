import React, {SetStateAction, useEffect, useState} from "react";
import {AxisOptions, AxisTimeOptions, Chart} from "react-charts";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import {UserSerie} from "react-charts/types/types";

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

  const {data: payload, error, isLoading} = useQuery(["cpuUsage"], () =>
    axios
      .get("http://localhost:8080/api/v1/actualCpuUsageByRangeSeconds", { params:
          {start: subtractSeconds(new Date(), 10).toISOString(), end: new Date().toISOString()}
      })
      .then((res) => res.data)
  , {refetchInterval: 1000});

  console.log(payload);
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
        scaleType: "linear"
      },
    ],
    []
  )

  useEffect(() => {
    if (!payload) return;

    const newData = payload.map((currentNodeData: NodeCpuUsageApiPayload) => ({
      label: currentNodeData.nodeName,
      data: payload.find((u: NodeCpuUsageApiPayload) => u.nodeName == currentNodeData.nodeName)?.usage.map((elem: InstantCpuUsage) => ({
        timestamp: new Date(elem.timestamp),
        data: elem.data
      }))
    }));

    console.log(newData);

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