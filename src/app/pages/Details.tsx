import { useDqlQuery } from "@dynatrace-sdk/react-hooks";
import { Button, Container, Flex, Heading, List, ProgressCircle, SkeletonText, Text } from "@dynatrace/strato-components";
import { ChartInteractions, ChartSeriesAction, ChartToolbar, convertToTimeseries, DataTable, NumberInput, SimpleTable, Tab, TableColumn, Tabs, Timeseries, TimeseriesChart } from "@dynatrace/strato-components-preview";
import React, { useEffect, useState } from "react";
import { cpuUsageQueryResult, errorQueryResult, hostTagsQueryResult, meantimeQueryResult, memoryUsageQueryResult, serviceTagsQueryResult, throughputQueryResult } from "../Data/QueryResult";
import { PassCriteria } from "../components/PassCriteria";
import { MatchTags, MatchTagsWithTags } from "../components/MatchTags";
import { useLocation } from "react-router-dom";
import { InternetIcon } from "@dynatrace/strato-icons";
import { getEnvironmentUrl } from "@dynatrace-sdk/app-environment";
import { useDocContext } from "../components/DocProvider";

interface ExtendedTimeseries extends Timeseries {
  name: string[];
}

export const Details = () => {
  // const location = useLocation();
  // const { run, cycle, from, to} = location.state || {};

  const { docContent, setDocContent, updateDocContent } = useDocContext();

  const cycle = "cycle01"
  const run = 'run01'
  const from = '2024-11-12T06:00:00.000Z'
  const to = '2024-11-19T03:00:00.000Z'

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
  const throughput = throughputQueryResult({from: from, to: to, run: run, cycle: cycle});

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

  const errorData = error.data?.records?.filter(item => item?.cycle === cycle && item?.run === run).map(item => item) || [];
  const timeData = meantime.data?.records?.filter(item => item?.cycle === cycle && item?.run === run).map(item => item) || [];
  const throughputData = throughput.data?.records?.filter(item => item?.cycle === cycle && item?.run === run).map(item => item).map(item => {
    if (item && item.count && Array.isArray(item.count)) {
      // Convert interval to minutes
      const interval = Number(item.interval) / 1e9 / 60;

      // Update count by dividing each element by interval
      const updatedCount = item.count.map(data => typeof data == "number" ? (data / interval).toFixed(2) : null);

      // Return the updated item with the modified count
      return { ...item, count: updatedCount };
    }
    return item; // Return the item as is if the conditions aren't met
  }) || [];
  const cpuData: any[] = [];
  const memoryData: any[] = [];


  host.forEach(item => {
    const matchingCpuHosts = cpu.data?.records?.filter(record => record?.id === item.id) || [];
    cpuData.push(...matchingCpuHosts);

    const matchingMemoryHosts = memory.data?.records?.filter(record => record?.id === item.id) || [];
    memoryData.push(...matchingMemoryHosts);
  });
  
  // Function to calculate the average of an array
  const calculateAverage = (data, field) => {
    return data
      .flatMap(item => item?.[field] || []) // Access the field dynamically
      .filter(value => typeof value === "number") // Filter only numbers
      .reduce((sum, value, _, arr) => sum + value / arr.length, 0); // Calculate average
  };

  const [matchedCriteria, setMatchedCriteria] = useState([]);
  const getMactchedCriteria = async () => {
    const matchingCriteria = await docContent.find(
      (criteria) => criteria.cycle === cycle && criteria.run === run
    );
    const criteria = matchingCriteria?.criteria;

    setMatchedCriteria(criteria);
  }

  useEffect(() => {
    getMactchedCriteria()
  }, [docContent])

  const handleChange = async (cycle: string, run: string, key: string, newValue: number) => {
    setDocContent((prevState) => {
      // Check if the item with the given cycle and run exists
      const itemIndex = prevState.findIndex(
        (item) => item.cycle === cycle && item.run === run
      );
  
      if (itemIndex !== -1) {
        // If found, update the existing item
        return prevState.map((item, index) =>
          index === itemIndex
            ? {
                ...item,
                criteria: {
                  ...item.criteria,
                  [key]: newValue, // Update the specific key in criteria
                },
              }
            : item
        );
      } else {
        // If not found, add a new item
        return [
          ...prevState,
          {
            cycle: cycle,
            run: run,
            criteria: {
              [key]: newValue, // Set the key-value pair in criteria for the new item
            },
          },
        ];
      }
    });
  };
  

  const rowData = [
    {
      metric: "Failure Rate",
      target: matchedCriteria ? matchedCriteria["Failure Rate"] : 10.0,
      result: calculateAverage(errorData, "error"),
      status: ''
    },
    {
      metric: "Response Time",
      target: matchedCriteria ? matchedCriteria["Response Time"] : 120000.0,
      result: calculateAverage(timeData, "meantime"),
      status: ''
    },
    {
      metric: "CPU Usage",
      target: matchedCriteria ? matchedCriteria["CPU Usage"] : 90.0,
      result: calculateAverage(cpuData, "usage"),
      status: ''
    },
    {
      metric: "Memory Usage",
      target: matchedCriteria ? matchedCriteria["Memory Usage"] : 90.0,
      result: calculateAverage(memoryData, "usage"),
      status: ''
    },
  ]

  const columns: TableColumn[] = [
    {
      header: "Metric",
      accessor: 'metric',
      ratioWidth:1
    },
    {
      header: 'Target',
      accessor: 'target',
      ratioWidth:1,
      cell: (row) => {
        return(
          <DataTable.Cell>
            <NumberInput value={row.value} onChange={e => handleChange(cycle, run, row.row.original.metric, Number(e))}/>
          </DataTable.Cell>
        )
      }
    },
    {
      header: "Result (Avg)",
      accessor: 'result',
      ratioWidth:1
    },
    {
      id: 'status',
      header: 'Status',
      accessor: row => row.value = row.result > row.target ? "Failed" : "Passed",
      cell: (row) => {
        return (
          <DataTable.Cell>
            {row.value === "Failed"  ? <DataTable.Cell style={{backgroundColor: 'red'}}/> : <DataTable.Cell style={{backgroundColor: 'green'}}/>}
          </DataTable.Cell>
        )
      },
      ratioWidth:1
    }
  ]

  const propertiesColumns: TableColumn[] = [
    {
      header: "Properties",
      accessor: 'key',
      cell: (row) => {
        return(
          <DataTable.Cell>{row.value.charAt(0).toUpperCase() + row.value.slice(1)}</DataTable.Cell>
        )
      }
    },
    {
      header: '',
      accessor: 'value'
    }
  ]

  const propertiesData = runQuery.data?.records.flatMap(item =>
    item ? Object.entries(item).map(([key, value]) => {
      if (key === "timeframe" && value) {
        // Value is an object; create a main row with subRows
        const subRows = Object.values(value).map(value => value.toLocaleString())
        return {
          key: key,
          value: subRows.join(" - "),
        };
      } else {
        // Value is not an object; return a single row
        return {
          key: key,
          value: value?.toLocaleString(),
        };
      }
    }) : []
  );

  return (
    <Flex width='100%' flexDirection='column' justifyContent='center' gap={16}>
      <Flex width='100%' flexDirection="row">
        <Container width="100%">
          <Heading level={2}>Properties</Heading>
          {propertiesData && <DataTable data={propertiesData} columns={propertiesColumns}/>}
        </Container>
        <Container width="100%">
          <Heading level={2}>Success Criteria</Heading>
          <Flex flexDirection="column">
            {(error.isLoading || meantime.isLoading || cpu.isLoading || memory.isLoading) ? (
              <SkeletonText />
            ) : (
              <>
                <DataTable data={rowData} columns={columns}>
                <DataTable.Toolbar>
                  <DataTable.DownloadData />
                </DataTable.Toolbar>
                </DataTable>
                <Button color="primary" variant="emphasized" onClick={() => updateDocContent()}>Update</Button>
              </>
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
                  <ChartInteractions>
                    <ChartInteractions.Zoom />
                    <ChartInteractions.ZoomX />
                    <ChartInteractions.Pan />
                  </ChartInteractions>
                  <TimeseriesChart.Legend hidden/>
                  <TimeseriesChart.YAxis label="Failure Rate" formatter={(value) => `${value.toFixed(2)} error(s)` }/>
                  <TimeseriesChart.XAxis
                    label="Time"
                    min={from}
                    max={to}
                  />
                </TimeseriesChart>}
            </Flex>
            <Flex flexDirection="column" width="50%">
              <Heading level={3}>Mean Response Time</Heading>
              {meantime.isLoading && <ProgressCircle />}
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
                  <ChartInteractions>
                    <ChartInteractions.Zoom />
                    <ChartInteractions.ZoomX />
                    <ChartInteractions.Pan />
                  </ChartInteractions>
                  <TimeseriesChart.Legend hidden/>
                  <TimeseriesChart.YAxis label="Mean Response Time (s)"  formatter={(value) => `${(value/1000).toFixed(2)} seconds` }/>
                  <TimeseriesChart.XAxis
                    label="Time"
                    min={from}
                    max={to}
                  />
                </TimeseriesChart>}
            </Flex>
          </Flex>
          <Flex flexDirection="column" width="100%">
            <Heading level={3}>Throughput</Heading>
            {throughput.isLoading && <ProgressCircle />}
            {throughput.data && 
              <TimeseriesChart 
                data={convertToTimeseries(throughputData, throughput.data?.types)}
                variant="bar"
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
                  <ChartInteractions>
                    <ChartInteractions.Zoom />
                    <ChartInteractions.ZoomX />
                    <ChartInteractions.Pan />
                  </ChartInteractions>
                </ChartToolbar>
                <TimeseriesChart.Legend hidden/>
                <TimeseriesChart.YAxis label="Throughput"  formatter={(value) => `${value.toFixed(2)}/min` }/>
                <TimeseriesChart.XAxis
                  label="Time"
                  min={from}
                  max={to}
                />
              </TimeseriesChart>}
          </Flex>
          <Flex flexDirection="row" width="100%">
            <Flex flexDirection="column" width="50%">
              <Heading level={3}>CPU Usage</Heading>
              {cpu.isLoading && <ProgressCircle />}
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
                  <ChartInteractions>
                    <ChartInteractions.Zoom />
                    <ChartInteractions.ZoomX />
                    <ChartInteractions.Pan />
                  </ChartInteractions>
                  <TimeseriesChart.Legend hidden/>
                  <TimeseriesChart.YAxis label="CPU Usage"  formatter={(value) => `${value.toFixed(2)}%` }/>
                  <TimeseriesChart.XAxis
                    label="Time"
                    min={"-30d"}
                    max={to}
                  />
                </TimeseriesChart>}
            </Flex>
            <Flex flexDirection="column" width="50%">
              <Heading level={3}>Memory Usage</Heading>
              {memory.isLoading && <ProgressCircle />}
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
                  <ChartInteractions>
                    <ChartInteractions.Zoom />
                    <ChartInteractions.ZoomX />
                    <ChartInteractions.Pan />
                  </ChartInteractions>
                  <TimeseriesChart.Legend hidden/>
                  <TimeseriesChart.YAxis label="Memory Usage"  formatter={(value) => `${value.toFixed(2)}%` }/>
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
