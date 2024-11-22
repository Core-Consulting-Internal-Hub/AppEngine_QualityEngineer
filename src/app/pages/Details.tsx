import { useDqlQuery } from "@dynatrace-sdk/react-hooks";
import { Container, Flex, Heading, List, ProgressCircle, SkeletonText, Text } from "@dynatrace/strato-components";
import { ChartSeriesAction, ChartToolbar, convertToTimeseries, DataTable, SimpleTable, Tab, Tabs, Timeseries, TimeseriesChart } from "@dynatrace/strato-components-preview";
import React, { useState } from "react";
import { cpuUsageQueryResult, errorQueryResult, hostTagsQueryResult, meantimeQueryResult, memoryUsageQueryResult, serviceTagsQueryResult } from "../Data/QueryResult";
import { PassCriteria } from "../components/PassCriteria";
import { MatchTags, MatchTagsWithTags } from "../components/MatchTags";
import { useLocation } from "react-router-dom";
import { InternetIcon } from "@dynatrace/strato-icons";
import { getEnvironmentUrl } from "@dynatrace-sdk/app-environment";

interface ExtendedTimeseries extends Timeseries {
  name: string[];
}

export const Details = () => {
  // const location = useLocation();
  // const { run, cycle, from, to} = location.state || {};
  const run = "run01"
  const cycle = "cycle02"
  const from = "2024-11-21T10:10:00.000Z"
  const to = "2024-11-21T10:40:00.000Z"

  const runQuery = useDqlQuery({
    body: {
      query: `timeseries meantime = avg(jmeter.usermetrics.transaction.meantime), from: "${from}", to: "${to}", by: { run, transaction, cycle, scenario }
      | filter run == "${run}" and cycle == "${cycle}"  
      | summarize by:{timeframe, run, cycle, scenario} , transaction = collectArray(transaction)`
    }
  });

  

  const transactions = runQuery.data?.records[0] && runQuery.data?.records[0].transaction;
  const error = errorQueryResult({from: from, to: to, run: run, cycle: cycle});
  const meantime = meantimeQueryResult({from: from, to: to, run: run, cycle: cycle});

  const host = MatchTags({queryResult: hostTagsQueryResult({from: from, to: to}), row: transactions});
  const service = MatchTagsWithTags({queryResult: serviceTagsQueryResult({from: from, to: to}), row: transactions});
  
  const hostLinks = Array.from(host.values()).map((host) => ({
    name: host.name,
    link: `${getEnvironmentUrl()}/ui/apps/dynatrace.classic.services/ui/entity/${host.id}`,
  }));

  const serviceLinks = Array.from(service.values()).map((service, index) => ({
    index: index + 1,
    name: service.name,
    link: `${getEnvironmentUrl()}/ui/apps/dynatrace.classic.services/ui/entity/${service.id}`,
    tag: service.tags
  }));

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

  // State to track inputs for each row by their ID
  const [inputs, setInputs] = useState({});

  // Function to calculate the average of an array
  const calculateAverage = (data, field) => {
    return data
      .flatMap(item => item?.[field] || []) // Access the field dynamically
      .filter(value => typeof value === "number") // Filter only numbers
      .reduce((sum, value, _, arr) => sum + value / arr.length, 0); // Calculate average
  };

  // Determine background color for a row
  const getBackgroundColor = (id, average) => {
    const target = Number(inputs[id]);
    if (isNaN(target)) return ""; // No color if no valid target
    return target < average ? "red" : "green"; // Red if target < average, Green otherwise
  };

  // Handle input change for a specific row
  const handleInputChange = (id, value) => {
    setInputs((prev) => ({ ...prev, [id]: value }));
  };

  const rows = [
    { id: "failureRate", label: "Failure Rate", data: errorData, field: "error" },
    { id: "responseTime", label: "Response Time", data: timeData, field: "meantime" },
    { id: "cpuUsage", label: "CPU Usage", data: cpuData, field: "usage" },
    { id: "memoryUsage", label: "Memory Usage", data: memoryData, field: "usage" },
  ];

  console.log(errorData, timeData, cpuData, memoryData);

  return (
    <Flex width='100%' flexDirection='column' justifyContent='center' gap={16}>
      <Flex width='100%' flexDirection="row">
        <Container width="100%">
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
        <Container width="100%">
          <Heading level={2}>Success Criteria</Heading>
          <Flex flexDirection="column">
            {(error.isLoading || meantime.isLoading || cpu.isLoading || memory.isLoading) ? (
              <SkeletonText />
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", margin: "20px 0" }}>
                <thead>
                  <tr style={{ backgroundColor: "var(--header-bg)", color: "var(--header-text)", }}>
                    <th style={{ border: "1px solid #ddd", padding: "10px", textAlign: "left" }}>Metric</th>
                    <th style={{ border: "1px solid #ddd", padding: "10px", textAlign: "left" }}>Target</th>
                    <th style={{ border: "1px solid #ddd", padding: "10px", textAlign: "left" }}>Average</th>
                    <th style={{ border: "1px solid #ddd", padding: "10px", textAlign: "left" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => {
                    const average = calculateAverage(row.data, row.field);
                    return (
                      <tr
                        key={row.id}
                        style={{
                          backgroundColor: "var(--row-bg)",
                          borderBottom: "1px solid #ddd",
                          transition: "background-color 0.3s",
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "var(--row-hover-bg)")}
                        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "var(--row-bg)")}
                      >
                        <td style={{ border: "1px solid #ddd", padding: "10px" }}>{row.label}</td>
                        <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                          <input
                            type="number"
                            value={inputs[row.id] || ""}
                            onChange={(e) => handleInputChange(row.id, e.target.value)}
                            style={{
                              width: "100%",
                              padding: "8px",
                              border: "1px solid #ccc",
                              borderRadius: "4px",
                              boxSizing: "border-box",
                            }}
                          />
                        </td>
                        <td style={{ border: "1px solid #ddd", padding: "10px" }}>{average.toFixed(2)}</td>
                        <td
                          style={{
                            border: "1px solid #ddd",
                            padding: "10px",
                            textAlign: "center",
                            fontWeight: "bold",
                            color: "var(--status-text)",
                            backgroundColor: getBackgroundColor(row.id, average),
                          }}
                        ></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </Flex>
        </Container>
      </Flex>
      <Flex>
        <Container width="100%">
          <Flex flexDirection="row" width="100%">
            <Flex flexDirection="column" width="50%">
              <Heading level={3}>Failure Rate</Heading>
              {error.isLoading && <ProgressCircle />}
              {error.data && 
                <TimeseriesChart 
                  data={convertToTimeseries(errorData, error.data?.types)}
                  seriesActions={(seriesActions) => {
                    const action = seriesActions as ExtendedTimeseries
                    const link = action.name.reduce((result, item) => {
                      if (result) return result;
                      return serviceLinks.find((service) =>
                        service.tag.some((tag) => {
                          const tagValue = tag.split(":");
                          return tagValue[tagValue.length - 1] === item;
                        })
                      );
                    }, null);

                    return (
                      <ChartSeriesAction>
                        <ChartSeriesAction.Item
                          onSelect={() => {
                            window.open(link?.link)
                          }}
                        >
                          <ChartSeriesAction.ItemIcon>
                            <InternetIcon />
                          </ChartSeriesAction.ItemIcon>
                          {link?.name}
                        </ChartSeriesAction.Item>
                      </ChartSeriesAction>
                    );
                  }}
                >
                  <ChartToolbar>
                    <ChartToolbar.DownloadData />
                  </ChartToolbar>
                  <TimeseriesChart.Legend hidden/>
                  <TimeseriesChart.YAxis label="Failure Rate"/>
                  <TimeseriesChart.XAxis
                    label="Time"
                    min={from}
                    max={to}
                  />
                </TimeseriesChart>}
            </Flex>
            <Flex flexDirection="column" width="50%">
              <Heading level={3}>Mean Response Time</Heading>
              {error.isLoading && <ProgressCircle />}
              {meantime.data && 
                <TimeseriesChart 
                  data={convertToTimeseries(timeData, meantime.data?.types)}
                  seriesActions={(seriesActions) => {
                    const action = seriesActions as ExtendedTimeseries
                    const link = action.name.reduce((result, item) => {
                      if (result) return result; // Stop searching if a match is found
                      return serviceLinks.find((service) =>
                        service.tag.some((tag) => {
                          const tagValue = tag.split(":");
                          return tagValue[tagValue.length - 1] === item;
                        })
                      );
                    }, null);

                    return (
                      <ChartSeriesAction>
                        <ChartSeriesAction.Item
                          onSelect={() => {
                            window.open(link?.link)
                          }}
                        >
                          <ChartSeriesAction.ItemIcon>
                            <InternetIcon />
                          </ChartSeriesAction.ItemIcon>
                          {link?.name}
                        </ChartSeriesAction.Item>
                      </ChartSeriesAction>
                    );
                  }}
                >
                  <ChartToolbar>
                    <ChartToolbar.DownloadData />
                  </ChartToolbar>
                  <TimeseriesChart.Legend hidden/>
                  <TimeseriesChart.YAxis label="Mean Response Time (ms)"/>
                  <TimeseriesChart.XAxis
                    label="Time"
                    min={from}
                    max={to}
                  />
                </TimeseriesChart>}
            </Flex>
          </Flex>
          <Flex flexDirection="row" width="100%">
            <Flex flexDirection="column" width="50%">
              <Heading level={3}>CPU Usage</Heading>
              {error.isLoading && <ProgressCircle />}
              {cpu.data && 
                <TimeseriesChart 
                  data={convertToTimeseries(cpuData, cpu.data?.types)}
                  seriesActions={(seriesActions) => {
                    const action = seriesActions as ExtendedTimeseries
                    const link = action.name.reduce((result, item) => {
                      if (result) return result; // Stop searching if a match is found
                      return hostLinks.find((host) =>
                        host.name === item
                      );
                    }, null);

                    return (
                      <ChartSeriesAction>
                        <ChartSeriesAction.Item
                          onSelect={() => {
                            window.open(link?.link)
                          }}
                        >
                          <ChartSeriesAction.ItemIcon>
                            <InternetIcon />
                          </ChartSeriesAction.ItemIcon>
                          {link?.name}
                        </ChartSeriesAction.Item>
                      </ChartSeriesAction>
                    );
                  }}
                >
                  <ChartToolbar>
                    <ChartToolbar.DownloadData />
                  </ChartToolbar>
                  <TimeseriesChart.Legend hidden/>
                  <TimeseriesChart.YAxis label="CPU Usage(%)"/>
                  <TimeseriesChart.XAxis
                    label="Time"
                    min={"-30d"}
                    max={to}
                  />
                </TimeseriesChart>}
            </Flex>
            <Flex flexDirection="column" width="50%">
              <Heading level={3}>Memory Usage</Heading>
              {error.isLoading && <ProgressCircle />}
              {memory.data && 
                <TimeseriesChart 
                  data={convertToTimeseries(memoryData, memory.data?.types)}
                  seriesActions={(seriesActions) => {
                    const action = seriesActions as ExtendedTimeseries
                    const link = action.name.reduce((result, item) => {
                      if (result) return result; // Stop searching if a match is found
                      return hostLinks.find((host) =>
                        host.name === item
                      );
                    }, null);

                    return (
                      <ChartSeriesAction>
                        <ChartSeriesAction.Item
                          onSelect={() => {
                            window.open(link?.link)
                          }}
                        >
                          <ChartSeriesAction.ItemIcon>
                            <InternetIcon />
                          </ChartSeriesAction.ItemIcon>
                          {link?.name}
                        </ChartSeriesAction.Item>
                      </ChartSeriesAction>
                    );
                  }}
                >
                  <ChartToolbar>
                    <ChartToolbar.DownloadData />
                  </ChartToolbar>
                  <TimeseriesChart.Legend hidden/>
                  <TimeseriesChart.YAxis label="Memory Usage(%)"/>
                  <TimeseriesChart.XAxis
                    label="Time"
                    min={"-30d"}
                    max={to}
                  />
                </TimeseriesChart>}
            </Flex>
          </Flex>
        </Container>
      </Flex>
    </Flex>
  )
}
