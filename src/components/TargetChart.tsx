import React, {useEffect, useState} from "react";
import {AxisOptions, Chart} from "react-charts";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import {UserSerie} from "react-charts/types/types";
import {Box, Spinner, useColorMode} from "@chakra-ui/react";

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
  const [lineColors, setLineColors] = useState<string[]>([]);

  const {data: cpuUsagePayload, error, isLoading} = useQuery(["cpuUsage"], () =>
    axios
      .get("http://localhost:8080/api/v1/actualCpuUsageByRangeSeconds", { params:
          {start: subtractSeconds(new Date(), 10).toISOString(), end: new Date().toISOString()}
      })
      .then((res) => res.data)
  , {refetchInterval: 1000});

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
        scale: (value: Date) => {
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

    const cpuUsages = cpuUsagePayload.map((currentNodeData: NodeCpuUsageApiPayload) => ({
      label: currentNodeData.nodeName,
      data: cpuUsagePayload.find((u: NodeCpuUsageApiPayload) => u.nodeName == currentNodeData.nodeName)?.usage.map((elem: InstantCpuUsage) => ({
        timestamp: new Date(elem.timestamp),
        data: elem.data
      }))
    }));

    const rulers = Object.entries(targetsPayload.targets).map(([key, value]) => ({
      label: key + "-target",
      data: cpuUsages?.find((elem: UserSerie<NodeCpuUsageApiPayload>) => elem.label == key).data?.map((elem2: InstantCpuUsage) => ({
        timestamp: new Date(elem2.timestamp),
        data: value
      })),
    }))
    cpuUsages.push(...rulers);

    // Supports up to 5 nodes/targets atm
    // For more palettes Seaborn from Python is a good source
    const colors = ["#8C613C", "#DC7EC0", "#797979", "#D5BB67", "#82C6E2",
      "#4878D0", "#EE854A", "#6ACC64", "#D65F5F", "#956CB4"];

    // Set colors for each serie
    // Note this does not work with multiple nodes per target
    setLineColors([...Array(cpuUsages.length).keys()].map((i) => {
      return colors[i % cpuUsages.length]!;
    }));

    setGraphData(cpuUsages);
  }, [cpuUsagePayload]);

  const { colorMode } = useColorMode()

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
        getSeriesStyle: series => {
          if (series.label.endsWith("-target")) {
            return {strokeDasharray:"6,3"};
          }
          return {};
        },
        defaultColors: lineColors,
        dark: colorMode === "dark",
      }}
    />
  )
}

export default TargetChart;