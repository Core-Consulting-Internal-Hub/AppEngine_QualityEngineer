import { Container, Flex, ProgressCircle, Text } from "@dynatrace/strato-components";
import { convertToTimeseries, DataTable, FilterBar, SelectV2, TableColumn, TextInput, TimeframeSelector, TimeframeV2 } from "@dynatrace/strato-components-preview";
import React, { useEffect, useState } from "react";
import { useDqlQuery } from "@dynatrace-sdk/react-hooks";
import { ExternalLinks } from "../components/ExternalLinks";
import { cpuUsageQueryResult, errorQueryResultScenario, hostTagsQueryResult, meantimeQueryResultScenario, memoryUsageQueryResult, processTagsQueryResult, serviceTagsQueryResult, tagsQueryResult } from "../Data/QueryResult";
import { subHours, subDays } from "date-fns"
import { Link as RouterLink } from 'react-router-dom';
import { ExternalLink, Link, List } from '@dynatrace/strato-components/typography';
import { getEnvironmentUrl } from "@dynatrace-sdk/app-environment";
import { MatchTags } from "../components/MatchTags";
import { PassCriteria } from "../components/PassCriteria";
import { useDocContext } from "../components/DocProvider";

export const CycleRun = () => {
  const { docContent, setDocContent, updateDocContent } = useDocContext();
  const [time, setTime] = useState<TimeframeV2 | null>({
    from: {
      absoluteDate: subDays(new Date(), 7).toISOString(),
      value: 'now()-7d',
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

  const [loading, setLoading] = useState(true)
  const [filteredData, setFilteredData] = useState<any[]>([]); // State for filtered data

  // States for filters
  const [transactionFilter, setTransactionFilter] = useState<string | null>(null);
  const [cycleRunFilter, setCycleRunFilter] = useState<string | null>(null);
  const [hostFilter, setHostFilter] = useState<string | null>(null);
  const [processFilter, setProcessFilter] = useState<string | null>(null);
  const [serviceFilter, setServiceFilter] = useState<string | null>(null);
  const [passFailFilter, setPassFailFilter] = useState<string | null>(null);

  // Filter logic
  useEffect(() => {
    const filtered = rowData.filter((row) => {
      const matchesTransaction = transactionFilter
        ? row.transactions.some((transaction) => transaction.includes(transactionFilter))
        : true;

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
  
  const error = errorQueryResultScenario({
    from: time?.from.absoluteDate,
    to: time?.to.absoluteDate,
  });

  const meantime = meantimeQueryResultScenario({
    from: time?.from.absoluteDate,
    to: time?.to.absoluteDate,
  });

  const cpu = cpuUsageQueryResult({
    from: time?.from.absoluteDate,
    to: time?.to.absoluteDate,
  });

  const memory = memoryUsageQueryResult({
    from: time?.from.absoluteDate,
    to: time?.to.absoluteDate,
  });

  useEffect(() => {
    // Reset row data and loading state when time changes
    setLoading(true);
    setRowData([]);
  }, [time]);

  useEffect(() => {
    setLoading(true);
    setRowData([])
    // Avoid re-render if there's no need to update
    if (
      !tags.isLoading &&
      !specificTimeUsage.isLoading &&
      !hosts.isLoading &&
      !processes.isLoading &&
      !services.isLoading &&
      !error.isLoading &&
      !meantime.isLoading &&
      !cpu.isLoading &&
      !memory.isLoading
    ) {
      // When all data is loaded, process and update the rowData
      const processData = () => {
        tags.data?.records.forEach((row) => {
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
    time,
    time?.from.absoluteDate,
    time?.to.absoluteDate,
    tags.isLoading,
    specificTimeUsage.isLoading,
    hosts.isLoading,
    processes.isLoading,
    services.isLoading,
    error.isLoading,
    meantime.isLoading,
    cpu.isLoading,
    memory.isLoading,
  ]);
  // Ensure to check for all data once everything is fetched.  

  // Function to render Cycle|Run column
  const renderCycleRunCell = (row) => {
    const specificCycleRun = specificTimeUsage.data?.records.filter((item) => item && item.cycle === row.cycle && item.run === row.run);
    const datapoints = specificCycleRun && specificTimeUsage?.data && convertToTimeseries(specificCycleRun, specificTimeUsage.data.types);

    const start = datapoints?.[0]?.datapoints?.[0]?.start?.toISOString();
    const end = datapoints?.[0]?.datapoints?.[datapoints[0].datapoints.length - 1]?.end?.toISOString();
    updateRowData(row.cycle, row.run, "cycleRun", { cycle: row.cycle, run: row.run, start: start, end: end });
  };
  
  // Function to render Host(s) column
  const renderHostsCell = (row) => {
    const hostsMatched = MatchTags({
      queryResult: hosts,
      row: row.transaction,
    });
  
    const hostLinks = Array.from(hostsMatched.values()).map((host) => ({
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
  
    const processLinks = Array.from(processesMatched.values()).map((process) => ({
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

    const serviceLinks = Array.from(servicesMatched.values()).map((service, index) => ({
      index: index + 1,
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
  const renderPassFailCell = (row) => {
    const marks = PassCriteria({
      error: error.data?.records.map((r) => r && r.cycle === row.cycle && r.run === row.run && r.error),
      meantime: meantime.data?.records.map((r) => r && r.cycle === row.cycle && r.run === row.run && r.meantime),
      cpuUsage: cpu.data?.records.map((r) => r && r.cycle === row.cycle && r.run === row.run && r.usage),
      memoryUsage: memory.data?.records.map((r) => r && r.cycle === row.cycle && r.run === row.run && r.usage),
    });
    const passFail = marks.every((mark) => mark.score) ? "Passed" : "Failed";
    updateRowData(row.cycle, row.run, "passFail", passFail);
  };  

  const columns: TableColumn[] = [
    {
      header: 'Cycle|Run',
      accessor: 'cycleRun',
      autoWidth: true,
      ratioWidth: 1,
      cell: (row) => {
        return (
          <DataTable.Cell>
            {`${row.value.cycle}|${row.value.run}`}
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
      header: 'Host(s)',
      accessor: 'hosts',
      autoWidth: true,
      ratioWidth: 1,
      cell: (row) => {
        return (<DataTable.Cell>
          <ExternalLinks
            links ={row.value}
          />
        </DataTable.Cell>)
      }
    },
    {
      header: 'Process(es)',
      accessor: 'processes',
      autoWidth: true,
      ratioWidth: 1,
      cell: (row) => {
        return (<DataTable.Cell>
          <ExternalLinks
            links ={row.value}
          />
        </DataTable.Cell>)
      }
    },
    {
      header: 'Service(s)',
      accessor: 'services',
      autoWidth: true,
      ratioWidth: 2,
      cell: (row) => {
        return (
          <DataTable.Cell>
              <Flex flexDirection="column">
                {row.value.length === 0 ? <Text>N/A</Text> : row.value.map(item => {
                  return (
                    <Flex flexDirection="row">
                      <Text>{item.index}. </Text>
                      <ExternalLink href={item.link}>
                        <Link>{item.name}</Link>
                      </ExternalLink>
                    </Flex>
                  )
                })}
              </Flex>
          </DataTable.Cell>
        )
      }
    },
    {
      header: 'Transaction(s)',
      accessor: 'transactions',
      autoWidth: true,
      ratioWidth: 2,
      cell: (row) => {
        return (
          <DataTable.Cell>
            <List>
              {row.value.map(transaction => (
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
      // sortType: (a, b) => {
      //   console.log(a.values.scenarios)
      //   return 0;
      // }
    },
    {
      header: 'Pass/Fail',
      accessor: 'passFail',
      autoWidth: true,
      ratioWidth: 1,
      cell: (row) => {
        return (
          <>
            {(
              row.value === "Failed"
            ) ? (
              <DataTable.Cell style={{ backgroundColor: 'red' }}>{row.value}</DataTable.Cell>
            ) : (
              <DataTable.Cell style={{ backgroundColor: 'green' }}>{row.value}</DataTable.Cell>
            )}
          </>
        )
      }
    },
    {
      id: 'Details',
      header: 'Details',
      accessor: (row) => row,
      autoWidth: true,
      ratioWidth: 1,
      cell: (row) => {
        return(
          <DataTable.Cell>
            <Link as={RouterLink} to="/details" state={{cycle: row.value.cycleRun.cycle, run: row.value.cycleRun.run, from: row.value.cycleRun.start, to: row.value.cycleRun.end}}>Details</Link>
          </DataTable.Cell>
        )
      },
      disableSortBy: true,
    }
  ];

  return (
    <Container>
      <Flex flexDirection="row" justifyContent="space-between" marginBottom={12}>
        <FilterBar onFilterChange={() => {}}>
          <FilterBar.Item name="cycleRun" label="Filter by Cycle|Run">
            <TextInput
              placeholder="Filter by Cycle|Run"
              onChange={(e) => setCycleRunFilter(e)} // Update filter value
            />
            {/* <SelectV2 value={cycleRunFilter} onChange={setCycleRunFilter} clearable>
              <SelectV2.Content>
                {Array.from(new Set(rowData.map((row) => (
                  <SelectV2.Option key={row.cycleRun.cycle + row.cycleRun.run} value={row.cycleRun.cycle.charAt(0).toUpperCase() + row.cycleRun.cycle.slice(-2) + "|" + row.cycleRun.run.charAt(0).toUpperCase() + row.cycleRun.run.slice(-2)}>
                    {row.cycleRun.cycle.charAt(0).toUpperCase() + row.cycleRun.cycle.slice(-2) + "|" + row.cycleRun.run.charAt(0).toUpperCase() + row.cycleRun.run.slice(-2)}
                  </SelectV2.Option>
                ))))}
              </SelectV2.Content>
            </SelectV2> */}
          </FilterBar.Item>
          <FilterBar.Item name="transaction" label="Filter by transaction">
            <TextInput
              placeholder="Filter by transaction"
              onChange={(e) => setTransactionFilter(e)} // Update filter value
            />
          </FilterBar.Item>
        </FilterBar>
        <Flex>
          <FilterBar onFilterChange={() => {}}>
            <FilterBar.Item name="hosts" label="Filter by host">
              <SelectV2 value={hostFilter} onChange={setHostFilter} clearable>
                <SelectV2.Content>
                  {Array.from(new Set(rowData.flatMap((row) => row.hosts?.map((host) => host.name)))).map((hostName) => (
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
                  {Array.from(new Set(rowData.flatMap((row) => row.processes?.map((process) => process.name)))).map((processName) => (
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
                  {Array.from(new Set(rowData.flatMap((row) => row.services?.map((service) => service.name)))).map((serviceName) => (
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
        }}>
          <DataTable.Toolbar>
            <DataTable.DownloadData />
          </DataTable.Toolbar>
          <DataTable.Pagination />
      </DataTable>}
    </Container>
  )
}