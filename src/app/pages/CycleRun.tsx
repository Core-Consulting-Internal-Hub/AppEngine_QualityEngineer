import { Container, Flex, ProgressCircle, Text } from "@dynatrace/strato-components";
import { convertToTimeseries, DataTable, FilterBar, SelectV2, TableColumn, TextInput, TimeframeSelector, TimeframeV2 } from "@dynatrace/strato-components-preview";
import React, { useEffect, useState } from "react";
import { useDqlQuery } from "@dynatrace-sdk/react-hooks";
import { ExternalLinks } from "../components/ExternalLinks";
import { hostTagsQueryResult, processTagsQueryResult, serviceTagsQueryResult, tagsQueryResult } from "../Data/QueryResult";
import { subHours } from "date-fns"
import { Link as RouterLink } from 'react-router-dom';
import { Heading, Link, List } from '@dynatrace/strato-components/typography';
import { getEnvironmentUrl } from "@dynatrace-sdk/app-environment";
import { MatchTags, MatchTagsResult } from "../components/MatchTags";
import { useDocContext } from "../components/DocProvider";
import { Colors } from "@dynatrace/strato-design-tokens";
import { queryExecutionClient } from "@dynatrace-sdk/client-query";

export const CycleRun = () => {
  const { docContent } = useDocContext();
  const [time, setTime] = useState<TimeframeV2 | null>({
    from: {
      absoluteDate: subHours(new Date(), 2).toISOString(),
      value: 'now()-2h',
      type: 'expression',
    },
    to: {
      absoluteDate: new Date().toISOString(),
      value: 'now()',
      type: 'expression',
    },
  });

  const [rowData, setRowData] = useState<any[]>([]);
  const updateRowData = (cycle, run, key, value) => {
    setRowData((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.cycleRun?.cycle === cycle && item.cycleRun?.run === run
      );

      if (existingIndex > -1) {
        // Update existing entry
        const updatedItem = {
          ...prev[existingIndex],
          [key]: value,
        };
        const newData = [...prev];
        newData[existingIndex] = updatedItem;
        return newData;
      } else {
        // Add new entry
        return [
          ...prev,
          {
            cycleRun: {
              name: `${cycle}|${run}`,
            },
            [key]: value,
          },
        ];
      }
    });
  };

  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState<any[]>([]); // State for filtered data

  // States for filters
  const [transactionFilter, setTransactionFilter] = useState<string[]>([]);
  const [cycleRunFilter, setCycleRunFilter] = useState<string | null>(null);
  const [hostFilter, setHostFilter] = useState<string | null>(null);
  const [processFilter, setProcessFilter] = useState<string | null>(null);
  const [serviceFilter, setServiceFilter] = useState<string | null>(null);
  const [passFailFilter, setPassFailFilter] = useState<string | null>(null);

  // Filter logic
  useEffect(() => {
    const filtered = rowData.filter((row) => {
      const matchesTransaction = !transactionFilter || transactionFilter?.length === 0
        ? true
        : transactionFilter.some((filterValue) =>
            row.transactions.some((transaction) => transaction.includes(filterValue))
          );

      const matchesCycleRun = cycleRunFilter
        ? (row.cycleRun.cycle + "|" + row.cycleRun.run).includes(cycleRunFilter)
        : true;

      const matchesHost = hostFilter
        ? row.hosts?.some((host) => host.name === hostFilter)
        : true;

      const matchesProcess = processFilter
        ? row.processes?.some((process) => process.name === processFilter)
        : true;

      const matchesService = serviceFilter
        ? row.services?.some((service) => service.name === serviceFilter)
        : true;

      const matchesPassFail = passFailFilter
        ? row.passFail === passFailFilter
        : true;

      return (
        matchesTransaction &&
        matchesCycleRun &&
        matchesHost &&
        matchesProcess &&
        matchesService &&
        matchesPassFail
      );
    });

    setFilteredData(filtered);
  }, [transactionFilter, cycleRunFilter, hostFilter, processFilter, serviceFilter, passFailFilter, rowData]);

  const tags = tagsQueryResult({from: time?.from.absoluteDate, to: time?.to.absoluteDate})

  const specificTimeUsage = useDqlQuery({
    body: {
      query: `timeseries meantime = avg(jmeter.usermetrics.transaction.meantime), from: "${time?.from.absoluteDate}", to: "${time?.to.absoluteDate}", by: { run, cycle }
        | filter isNotNull(cycle) and isNotNull(run)`,
    },
  });

  const hosts = hostTagsQueryResult({ from: time?.from.absoluteDate, to: time?.to.absoluteDate });
  const processes = processTagsQueryResult({ from: time?.from.absoluteDate, to: time?.to.absoluteDate });
  const services = serviceTagsQueryResult({ from: time?.from.absoluteDate, to: time?.to.absoluteDate });

  useEffect(() => {
    setLoading(true);
    setRowData([]);
    // Avoid re-render if there's no need to update
    if (
      !tags.isLoading &&
      !specificTimeUsage.isLoading &&
      !hosts.isLoading &&
      !processes.isLoading &&
      !services.isLoading
    ) {
      // When all data is loaded, process and update the rowData
      const processData = () => {
        tags.data?.records?.forEach((row) => {   
            renderCycleRunCell(row);
            renderHostsCell(row);
            renderProcessesCell(row);
            renderServicesCell(row);
            renderTransactionsCell(row);
            renderScenariosCell(row)
            renderPassFailCell(row);
        });
        setLoading(false);
      };

      processData();
    }
  }, [
    tags.isLoading,
    specificTimeUsage.isLoading,
    hosts.isLoading,
    processes.isLoading,
    services.isLoading,
    docContent,
  ]);
  // Ensure to check for all data once everything is fetched.  

  // Function to render Cycle|Run column
  const renderCycleRunCell = (row) => {
    const specificCycleRun = specificTimeUsage?.data?.records?.filter((item) => item && item.cycle === row.cycle && item.run === row.run) || [];
    const datapoints = specificCycleRun && specificTimeUsage?.data && convertToTimeseries(specificCycleRun, specificTimeUsage.data.types) || [];

    const start = datapoints?.[0]?.datapoints?.[0]?.start?.toISOString();
    const end = datapoints?.[0]?.datapoints?.[datapoints?.[0]?.datapoints.length - 1]?.end?.toISOString();
    updateRowData(row.cycle, row.run, "cycleRun", { cycle: row.cycle, run: row.run, start: start, end: end });
  };
  
  // Function to render Host(s) column
  const renderHostsCell = (row) => {
    const hostsMatched = MatchTags({
      queryResult: hosts,
      row: row.transaction,
    });
  
    const hostLinks = Array.from(hostsMatched.values())?.map((host) => ({
      name: host.name,
      link: `${getEnvironmentUrl()}/ui/apps/dynatrace.classic.services/ui/entity/${host.id}`,
    }));
    updateRowData(row.cycle, row.run, "hosts", hostLinks);
  };

  // Function to render Processes column
  const renderProcessesCell = (row) => {
    const processesMatched = MatchTags({
      queryResult: processes,
      row: row.transaction,
    });
  
    const processLinks = Array.from(processesMatched.values())?.map((process) => ({
      name: process.name,
      link: `${getEnvironmentUrl()}/ui/apps/dynatrace.classic.technologies/#processgroupdetails;id=${process.id}`,
    }));
    updateRowData(row.cycle, row.run, "processes", processLinks);
  };

  // Function to render Service(s) column
  const renderServicesCell = (row) => {
    const servicesMatched = MatchTags({
      queryResult: services,
      row: row.transaction,
    });

    const serviceLinks = Array.from(servicesMatched.values())?.map((service) => ({
      name: service.name,
      link: `${getEnvironmentUrl()}/ui/apps/dynatrace.classic.services/ui/entity/${service.id}`,
    }));
    updateRowData(row.cycle, row.run, "services", serviceLinks);
  };
  
  // Function to render Transaction(s) column
  const renderTransactionsCell = (row) => {
    updateRowData(row.cycle, row.run, "transactions", row.transaction)
  };

  const renderScenariosCell = (row) => {
    updateRowData(row.cycle, row.run, "scenarios", row.scenario)
  }

  // Function to render Pass/Fail column
  const renderPassFailCell = async (row) => {
    const specificCycleRun = specificTimeUsage.data?.records.filter((item) => item && item.cycle === row.cycle && item.run === row.run) || [];
    const datapoint = specificCycleRun && specificTimeUsage?.data && convertToTimeseries(specificCycleRun, specificTimeUsage.data.types) || [];

    const start = datapoint && datapoint?.[0]?.datapoints?.[0]?.start?.toISOString();
    const end = datapoint && datapoint?.[0]?.datapoints?.[datapoint?.[0]?.datapoints?.length - 1]?.end?.toISOString();

    const [
      errorToken,
      throughputToken,
      meantimeToken,
      cpuToken,
      memoryToken,
      hostTagsToken,
    ] = await Promise.all([
      queryExecutionClient.queryExecute({
        body: {
          query: `timeseries error = avg(jmeter.usermetrics.transaction.error), from: "${start}", to: "${end}", by: { run, cycle, transaction }
                  | filter run == "${row.run}" and cycle == "${row.cycle}"
                  | sort arrayAvg(error) desc`,
        },
      }),
      queryExecutionClient.queryExecute({
        body: {
          query: `timeseries count = avg(jmeter.usermetrics.transaction.count), from: "${start}", to: "${end}", by: { cycle, run, transaction }
                  | filter run == "${row.run}" and cycle == "${row.cycle}"
                  | sort arrayAvg(count) desc`,
        },
      }),
      queryExecutionClient.queryExecute({
        body: {
          query: `timeseries meantime = avg(jmeter.usermetrics.transaction.meantime), from: "${start}", to: "${end}", by: { run, cycle, transaction }
                  | filter run == "${row.run}" and cycle == "${row.cycle}"
                  | sort arrayAvg(meantime) desc`,
        },
      }),
      queryExecutionClient.queryExecute({
        body: {
          query: `timeseries usage = avg(dt.host.cpu.usage), from: "${start}", to: "${end}", by: { dt.entity.host }
                  | fieldsAdd entityName(dt.entity.host)
                  | fieldsRename id = dt.entity.host`,
        },
      }),
      queryExecutionClient.queryExecute({
        body: {
          query: `timeseries usage = avg(dt.host.memory.usage), from: "${start}", to: "${end}", by: { dt.entity.host }
                  | fieldsAdd entityName(dt.entity.host)
                  | fieldsRename id = dt.entity.host`,
        },
      }),
      queryExecutionClient.queryExecute({
        body: {
          query: `fetch dt.entity.host, from: "${start}", to: "${end}"
                  | fieldsAdd tags
                  | filter isNotNull(tags)
                  | fieldsRename name = entity.name`,
        },
      }),
    ]);

    const performanceValue = async () => {
      if (
        !errorToken?.requestToken ||
        !throughputToken?.requestToken ||
        !meantimeToken?.requestToken || 
        !cpuToken?.requestToken || 
        !memoryToken?.requestToken || 
        !hostTagsToken?.requestToken
      ) {
        return {specificErrorPercentage: [], specificMeantimeData: [], matchedSpecificCpu: [], matchedSpecificMemory: []}
      }
    
      // Poll all results in parallel
      const [
        specificError,
        specificThroughput,
        specificMeantime,
        specificCpu,
        specificMemory,
        specificHostTags,
      ] = await Promise.all([
        queryExecutionClient.queryPoll({ requestToken: errorToken.requestToken }),
        queryExecutionClient.queryPoll({ requestToken: throughputToken.requestToken }),
        queryExecutionClient.queryPoll({ requestToken: meantimeToken.requestToken }),
        queryExecutionClient.queryPoll({ requestToken: cpuToken.requestToken }),
        queryExecutionClient.queryPoll({ requestToken: memoryToken.requestToken }),
        queryExecutionClient.queryPoll({ requestToken: hostTagsToken.requestToken }),
      ]);

        const specificThroughputData = specificThroughput.result?.records?.filter(item => item?.cycle === row.cycle && item?.run === row.run)?.map(item => item)?.map(item => {
          if (item && item.count && Array.isArray(item.count)) {
            // Convert interval to minutes
            const interval = Number(item.interval) / 1e9 / 60;
      
            // Update count by dividing each element by interval
            const updatedCount = item.count?.map(data => typeof data === "number" ? (data / interval) : null);
      
            // Return the updated item with the modified count
            return { ...item, count: updatedCount };
          }
          return item; // Return the item as is if the conditions aren't met
        }) || [];

        const specificErrorPercentage = specificError.result?.records.filter(item => item?.cycle === row.cycle && item?.run === row.run)?.map(item => item)?.map(failureItem => {
          const specificThroughputItem = specificThroughputData.find(item => item && failureItem && item.cycle === failureItem.cycle && item.run === failureItem.run && item.transaction === failureItem.transaction);
          if (Array.isArray(failureItem?.error)) {
            // Convert interval to minutes
            const interval = Number(failureItem?.interval) / 1e9 / 60;
      
            // Update count by dividing each element by interval
            const updatedCount = failureItem?.error?.map((data, i) => {
              const requestValue = specificThroughputItem?.count && specificThroughputItem.count[i];
              if (typeof data === 'number' && typeof requestValue === 'number' && requestValue !== 0) {
                return Number((((Number(data) / interval) / requestValue) * 100).toFixed(2));
              } else if (requestValue === 0) 
                return 0
              return null
            });
      
            // Return the updated item with the modified count
            return { ...failureItem, error: updatedCount };
          }
          return failureItem; // Return the item as is if the conditions aren't met
        }) || [];

        const matchedSpecificCpu: any[] = [];
        const matchedSpecificMemory: any[] = [];

        const host = MatchTagsResult({queryResult: specificHostTags, row: row.transaction})

        host.forEach(item => {
          const matchingCpuHosts = specificCpu.result?.records?.filter(record => record?.id === item.id) || [];
          matchedSpecificCpu.push(...matchingCpuHosts);
      
          const matchingMemoryHosts = specificMemory.result?.records?.filter(record => record?.id === item.id) || [];
          matchedSpecificMemory.push(...matchingMemoryHosts);
        });
        
        const specificMeantimeData = specificMeantime.result?.records?.map(item => ({
          ...item,
          meantime: Array.isArray(item?.meantime)
            ? item?.meantime?.map(value => (value ? Number(value) / 1000 : null))
            : []
        }));
        
        

        return {specificErrorPercentage, specificMeantimeData, matchedSpecificCpu, matchedSpecificMemory}
      }

    
    const { specificErrorPercentage, specificMeantimeData, matchedSpecificCpu, matchedSpecificMemory } = await performanceValue();
  
    // Utility: Calculate metric average from data and field
    const calculateMetricAverage = (data, field) => data
      ?.flatMap(item => item?.[field] || []) // Access the field dynamically
      .filter(value => typeof value === "number") // Filter only numbers
      .reduce((sum, value, _, arr) => sum + value / arr.length, 0) // Calculate average
      .toFixed(2);
  
    // Generate average data for the row
    const getAvgData = () => ({
      "Failure Rate": calculateMetricAverage(specificErrorPercentage, "error"),
      "Response Time": calculateMetricAverage(specificMeantimeData, "meantime"),
      "CPU Usage": calculateMetricAverage(matchedSpecificCpu, "usage"),
      "Memory Usage": calculateMetricAverage(matchedSpecificMemory, "usage"),
    });
  
    // Check criteria and return Pass/Fail with criteria type
    const checkCriteria = (avgData, docContent, cycle, run) => {
      const matchingCriteria = docContent.find(
        (criteria) => criteria.cycle === cycle && criteria.run === run
      );

      const criteria = matchingCriteria?.criteria || docContent.find(
        (criteria) => criteria.cycle === "default" && criteria.run === "default"
      )?.criteria;

      const criteriaType = matchingCriteria ? "customized" : "default";
      
      const passes = Object.entries(avgData).every(
        ([key, value]) => Number(value) <= (criteria[key])
      );
  
      return {
        result: passes ? "Passed" : "Failed",
        criteriaType,
      };
    };
  
    // Main logic
    const avgData = getAvgData();
    const { result, criteriaType } = checkCriteria(avgData, docContent, row.cycle, row.run);
  
    // Update row data if neededspecificError,
    updateRowData(row.cycle, row.run, "passFail", `${result} (${criteriaType})`);
  };
  

  const columns: TableColumn[] = [
    {
      id: 'cycleRun',
      header: 'Cycle|Run',
      accessor: row => `${row.cycleRun.cycle}|${row.cycleRun.run}`,
      autoWidth: true,
      ratioWidth: 1,
      cell: (row) => {
        return (
          <DataTable.Cell>
            {row.value}
          </DataTable.Cell>
        )
      },
      sortType: (a, b) => {
        const cycleA = a.values.cycleRun.cycle;
        const cycleB = b.values.cycleRun.cycle;
        const runA = a.values.cycleRun.run;
        const runB = b.values.cycleRun.run;

        if (cycleA === cycleB) {
          return runA.localeCompare(runB);
        }
        return cycleA.localeCompare(cycleB);
      }
    },
    {
      id: 'hosts',
      header: 'Host(s)',
      accessor: row => row.hosts?.map(item => item.name).join("\n"),
      autoWidth: true,
      ratioWidth: 1,
      cell: (row) => {
        return (<DataTable.Cell>
          <ExternalLinks
            links ={row.row.original.hosts}
          />
        </DataTable.Cell>)
      }
    },
    {
      id: 'processes',
      header: 'Process(es)',
      accessor: row => row.processes?.map(item => item.name).join("\n"),
      autoWidth: true,
      ratioWidth: 1,
      cell: (row) => {
        return (<DataTable.Cell>
          <ExternalLinks
            links ={row.row.original.processes}
          />
        </DataTable.Cell>)
      }
    },
    {
      id: 'sercives',
      header: 'Service(s)',
      accessor: row => row.services?.map(item => item.name).join("\n"),
      autoWidth: true,
      ratioWidth: 2,
      cell: (row) => {
        return (<DataTable.Cell>
          <ExternalLinks
            links ={row.row.original.services}
          />
        </DataTable.Cell>)
        
      }
    },
    {
      id: 'transactions',
      header: 'Transaction(s)',
      accessor: row => row.transactions?.join("\n"),
      autoWidth: true,
      ratioWidth: 2,
      cell: (row) => {
        return (
          <DataTable.Cell>
            <List>
              {row.row.original.transactions?.map(transaction => (
                <Text>{transaction}</Text>
              ))}
            </List>
          </DataTable.Cell>
        )
      }
    },
    {
      header: "Scenario",
      accessor: "scenarios",
      autoWidth: true,
      ratioWidth: 1,
      sortType: (a, b) => {
        const numA = parseInt(a.values.scenarios, 10); // Extracts the number from the string
        const numB = parseInt(b.values.scenarios, 10);
        return numA - numB; // Sort numerically
      }
    },
    {
      header: 'Pass/Fail(Criteria)',
      accessor: 'passFail',
      autoWidth: true,
      ratioWidth: 1,
      thresholds: [
        {
          value: "Failed (customized)",
          comparator: 'equal-to',
          backgroundColor: Colors.Background.Container.Critical.Accent,
        },
        {
          value: "Failed (default)",
          comparator: 'equal-to',
          backgroundColor: Colors.Background.Container.Critical.Accent,
        },
        {
          value: "Passed (customized)",
          comparator: 'equal-to',
          backgroundColor: Colors.Background.Container.Success.Accent
        },
        {
          value: "Passed (default)",
          comparator: 'equal-to',
          backgroundColor: Colors.Background.Container.Success.Accent
        }
      ],
      cell: (row) => {
        const seperatedValue = row?.value?.split(" ")
        return (
          <>
            {!row.value && <ProgressCircle />}
              <DataTable.Cell>
                <Flex flexDirection="column">
                  <Text textStyle="base-emphasized">{seperatedValue?.[0]}</Text>
                  <Text textStyle="small">{seperatedValue?.[1]}</Text>
                </Flex>
              </DataTable.Cell>
          </>
        )
      }
    },
    {
      id: 'Details',
      header: 'Details',
      accessor: 'details',
      autoWidth: true,
      ratioWidth: 1,
      cell: (row) => {
        return(
          <DataTable.Cell>
            <Link as={RouterLink} to="/details" state={{cycle: row.row.original.cycleRun.cycle, run: row.row.original.cycleRun.run, from: row.row.original.cycleRun.start, to: row.row.original.cycleRun.end}}>Details</Link>
          </DataTable.Cell>
        )
      },
      disableSortBy: true,
    }
  ];

  return (
    <Flex width={"100%"} flexDirection="column" justifyContent="center" gap={16}>
      <Heading level={1}>Cycle & Run</Heading>
      <Container>
        <Heading level={2}>Overview of all cycle & run</Heading>
        <Flex flexDirection="row" justifyContent="space-between" marginBottom={12} marginTop={12}>
          <FilterBar onFilterChange={() => {}}>
            <FilterBar.Item name="cycleRun" label="Filter by Cycle|Run">
              <TextInput
                placeholder="Filter by Cycle|Run"
                onChange={(e) => setCycleRunFilter(e)} // Update filter value
              />
            </FilterBar.Item>
            <FilterBar.Item name="transaction" label="Filter by transaction">
              <SelectV2 value={transactionFilter} onChange={setTransactionFilter} clearable multiple>
                <SelectV2.Content>
                  {Array.from(new Set(rowData?.flatMap((row) => row.transactions)))?.map((transaction) => 
                    <SelectV2.Option key={transaction} value={transaction}>
                      {transaction}
                    </SelectV2.Option>
                  )}
                </SelectV2.Content>
              </SelectV2>
              {/* <TextInput
                placeholder="Filter by transaction"
                onChange={(e) => setTransactionFilter(e)} // Update filter value
              /> */}
            </FilterBar.Item>
          </FilterBar>
          <Flex>
            <FilterBar onFilterChange={() => {}}>
              <FilterBar.Item name="hosts" label="Filter by host">
                <SelectV2 value={hostFilter} onChange={setHostFilter} clearable>
                  <SelectV2.Content>
                    {Array.from(new Set(rowData?.flatMap((row) => row.hosts?.map((host) => host.name))))?.map((hostName) => (
                      <SelectV2.Option key={hostName} value={hostName}>
                        {hostName}
                      </SelectV2.Option>
                    ))}
                  </SelectV2.Content>
                </SelectV2>
              </FilterBar.Item>
              <FilterBar.Item name="processes" label="Filter by process">
                <SelectV2 value={processFilter} onChange={setProcessFilter} clearable>
                  <SelectV2.Content>
                    {Array.from(new Set(rowData?.flatMap((row) => row.processes?.map((process) => process.name))))?.map((processName) => (
                      <SelectV2.Option key={processName} value={processName}>
                        {processName}
                      </SelectV2.Option>
                    ))}
                  </SelectV2.Content>
                </SelectV2>
              </FilterBar.Item>
              <FilterBar.Item name="services" label="Filter by service">
                <SelectV2 value={serviceFilter} onChange={setServiceFilter} clearable>
                  <SelectV2.Content>
                    {Array.from(new Set(rowData?.flatMap((row) => row.services?.map((service) => service.name))))?.map((serviceName) => (
                      <SelectV2.Option key={serviceName} value={serviceName}>
                        {serviceName}
                      </SelectV2.Option>
                    ))}
                  </SelectV2.Content>
                </SelectV2>
              </FilterBar.Item>
              <FilterBar.Item name="passFail" label="Filter by Pass/Fail">
                <SelectV2 value={passFailFilter} onChange={setPassFailFilter} clearable>
                  <SelectV2.Content>
                    <SelectV2.Option key={"Passed"} value={"Passed"}>
                      Passed
                    </SelectV2.Option>
                    <SelectV2.Option key={"Failed"} value={"Failed"}>
                      Failed
                    </SelectV2.Option>
                  </SelectV2.Content>
                </SelectV2>
              </FilterBar.Item>
              <FilterBar.Item name="time" label="Time">
                <TimeframeSelector value={time} onChange={setTime} />
              </FilterBar.Item>
            </FilterBar>
          </Flex>
        </Flex>
        
        
        {loading && <ProgressCircle/>}
        {!loading && <DataTable 
          data={filteredData} 
          // data={rowData}
          columns={columns}
          sortable
          variant={{
            rowDensity: 'default',
            rowSeparation: 'zebraStripes',
            verticalDividers: true,
            contained: true,
          }}
        >
            <DataTable.Toolbar>
              <DataTable.DownloadData />
            </DataTable.Toolbar>
            <DataTable.Pagination />
        </DataTable>}
      </Container>
    </Flex>
  )
}