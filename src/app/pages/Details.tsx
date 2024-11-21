import { useDqlQuery } from "@dynatrace-sdk/react-hooks";
import { Container, Flex, Heading, List, SkeletonText, Text } from "@dynatrace/strato-components";
import { convertToTimeseries, Tab, Tabs, TimeseriesChart } from "@dynatrace/strato-components-preview";
import React from "react";
import { cpuUsageQueryResult, errorQueryResult, hostTagsQueryResult, meantimeQueryResult, memoryUsageQueryResult } from "../Data/QueryResult";
import { PassCriteria } from "../components/PassCriteria";
import { MatchTags } from "../components/MatchTags";
import { useLocation } from "react-router-dom";

export const Details = () => {
  const location = useLocation();
  const { run, cycle, from, to} = location.state || {};

  const runQuery = useDqlQuery({
    body: {
      query: `timeseries meantime = avg(jmeter.usermetrics.transaction.meantime), from: "${from}", to: "${to}", by: { run, transaction, cycle, scenario}
      | filter run == "${run}" and cycle == "${cycle}"  
      | summarize by:{timeframe, run, cycle, scenario} , transaction = collectArray(transaction)`
    }
  });

  console.log(runQuery)

  const transactions = runQuery.data?.records[0] && runQuery.data?.records[0].transaction;
  const error = errorQueryResult({from: from, to: to, run: run, cycle: cycle});
  const meantime = meantimeQueryResult({from: from, to: to, run: run, cycle: cycle});

  const host = MatchTags({queryResult: hostTagsQueryResult({from: from, to: to}), row: transactions});
  const cpu = cpuUsageQueryResult({from: from, to: to});
  const memory = memoryUsageQueryResult({from: from, to: to});

  const errorValue = error.data?.records.filter(item => item?.run === run).map(item =>  item && item.error);
  const timeValue = meantime.data?.records.filter(item => item?.run === run).map(item => item && item.meantime);
  const cpuValue: any[] = [];
  const memoryValue: any[] = [];

  // Use a single loop for host and cpu/memory usage mapping
  host.forEach(item => {
    const matchingCpuHost = cpu.data?.records.find(record => record?.id === item.id);
    if (matchingCpuHost) {
      cpuValue.push(matchingCpuHost.usage);
    }

    const matchingMemoryHost = memory.data?.records.find(record => record?.id === item.id);
    if (matchingMemoryHost) {
      memoryValue.push(matchingMemoryHost.usage);
    }
  });

  const marks = PassCriteria({error: errorValue, meantime: timeValue, cpuUsage: cpuValue, memoryUsage: memoryValue});
  const totalMarks = marks.reduce((total, mark) => total + (mark.score || 0), 0);

  const errorData = error.data?.records?.filter(item => item?.run === run).map(item => item) || [];
  const timeData = meantime.data?.records?.filter(item => item?.run === run).map(item => item) || [];
  const cpuData: any[] = [];
  const memoryData: any[] = [];

  host.forEach(item => {
    const matchingCpuHosts = cpu.data?.records?.filter(record => record?.id === item.id) || [];
    cpuData.push(...matchingCpuHosts);

    const matchingMemoryHosts = memory.data?.records?.filter(record => record?.id === item.id) || [];
    memoryData.push(...matchingMemoryHosts);
  });

  return (
    <Flex width='100%' flexDirection='column' justifyContent='center' gap={16}>
      <Flex width='100%' flexDirection="row">
        <Container width="50%">
          <Heading level={2}>Properties</Heading>
          {runQuery.data?.records.map((item) => (
            <List>
              {item && Object.entries(item).map(([key, value]) => (
                <React.Fragment key={key}>
                  {key === "timeframe" && value && typeof value === "object" && "start" in value && "end" in value ? (
                    <>
                      <Text>{key.charAt(0).toUpperCase() + key.slice(1)}: Start: {value.start ? new Date(value.start as string | number).toLocaleString() : "N/A"}, End: {value.end ? new Date(value.end as string | number).toLocaleString() : "N/A"}</Text>
                    </>
                  ) : (
                    <Text>
                      {key.charAt(0).toUpperCase() + key.slice(1)}: {Array.isArray(value) ? value.join(', ') : String(value)}
                    </Text>
                  )}
                </React.Fragment>
              ))}
            </List>
          ))}

        </Container>
        <Container width="50%">
          <Heading level={2}>Grading</Heading>
          <Flex flexDirection="column">
            {(error.isLoading || meantime.isLoading || cpu.isLoading || memory.isLoading) ? (
              <SkeletonText />
            ) : (
              <>
                <Text>Pasing Rate: {totalMarks} / {marks.length}</Text>
                {totalMarks !== marks.length ? (
                  <>
                    <Text>Failing Reason: </Text>
                    <List>
                      {marks.map((mark) => (
                        mark.score === 0 ? (
                          mark.unit === "" ? (
                            <Text key={mark.category}>Number of {mark.category.charAt(0).toUpperCase() + mark.category.slice(1)} is more than {mark.threshold}</Text>
                          ) : (
                            <Text key={mark.category}>{mark.category.charAt(0).toUpperCase() + mark.category.slice(1)} consumption is higher than {mark.threshold}{mark.unit}</Text>
                          )
                        ) : null
                      ))}
                    </List>
                  </>
                ) : (
                  <Text>No Problem XD</Text>
                )}
              </>
            )}
          </Flex>
        </Container>
      </Flex>
      <Container>
        <Tabs defaultIndex={0}>
          <Tab title={"Error"}>
            {error.data != null && 
              <TimeseriesChart data={convertToTimeseries(errorData, error.data?.types)}>
                <TimeseriesChart.Legend hidden/>
                <TimeseriesChart.YAxis label="Number of Error"/>
                <TimeseriesChart.XAxis
                  label="Time"
                  min={from}
                  max={to}
                />
              </TimeseriesChart>}
          </Tab>
          <Tab title={"Mean Time"}>
            {meantime.data != null && 
              <TimeseriesChart data={convertToTimeseries(timeData, meantime.data?.types)}>
                <TimeseriesChart.Legend hidden/>
                <TimeseriesChart.YAxis label="Mean Time(ms)"/>
                <TimeseriesChart.XAxis
                  label="Time"
                  min={from}
                  max={to}
                />
              </TimeseriesChart>}
          </Tab>
          <Tab title={"CPU Usage"}>
            {cpu.data != null && 
              <TimeseriesChart data={convertToTimeseries(cpuData, cpu.data?.types)}>
                <TimeseriesChart.Legend hidden/>
                <TimeseriesChart.YAxis label="CPU Usage(%)"/>
                <TimeseriesChart.XAxis
                  label="Time"
                  min={from}
                  max={to}
                />
              </TimeseriesChart>}
          </Tab>
          <Tab title={"Memory Usage"}>
            {memory.data != null && 
              <TimeseriesChart data={convertToTimeseries(memoryData, memory.data?.types)}>
                <TimeseriesChart.Legend hidden/>
                <TimeseriesChart.YAxis label="Memory Usage(%)"/>
                <TimeseriesChart.XAxis
                  label="Time"
                  min={from}
                  max={to}
                />
              </TimeseriesChart>}
          </Tab>
        </Tabs>
      </Container>
    </Flex>
  )
}