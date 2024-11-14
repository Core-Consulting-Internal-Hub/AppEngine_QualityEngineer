import { Container, Flex, ProgressCircle } from "@dynatrace/strato-components";
import { DataTable, TableColumn, TextInput, TimeframeSelector, TimeframeV2 } from "@dynatrace/strato-components-preview";
import React, {  useState } from "react";
import { useDqlQuery } from "@dynatrace-sdk/react-hooks";
import { ExternalLinks, ExternalLinksWithNumberInput } from "../components/ExternalLinks";
import { hostTagsQueryResult, processTagsQueryResult, serviceTagsQueryResult } from "../Data/QueryResult";
import { subHours } from "date-fns"

export const Scenario = (props) => {
  // const [time, setTime] = useState<TimeframeV2 | null>({
  //   from: {
  //     absoluteDate: subHours(new Date(), 2).toISOString(),
  //     value: 'now()-2h',
  //     type: 'expression',
  //   },
  //   to: {
  //     absoluteDate: new Date().toISOString(),
  //     value: 'now()',
  //     type: 'expression',
  //   },
  // });

  // const [responseTimeData, setResponseTimeData] = useState(generateResponseTimeData(time));
  // const [failureRateData, setFailureRateData] = useState(generateFailureRateData(time));
  // const [cpuUsageData, setCpuUsageData] = useState(generateResponseTimeData(time));
  // const [throughputData, setThroughputData] = useState(generateThroughputData(time));

  // useEffect(() => {
  //   setResponseTimeData(generateResponseTimeData(time));
  //   setCpuUsageData(generateResponseTimeData(time));
  //   setThroughputData(generateThroughputData(time));
  //   setFailureRateData(generateFailureRateData(time));
  // }, [time])

  // const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
  // const [selectedRowsData, setSelectedRowsData] = useState([]);

  // const myRowSelectionChangedListener = (
  //   SelectedRows: Record<string, boolean>,
  //   selectedRowsData: [],
  //   trigger: 'user' | 'internal'
  // ) => {
  //   setSelectedRows(SelectedRows)
  //   setSelectedRowsData(selectedRowsData);
  // };

  // //Filter the data only for current timeframe
  // const filterDataByTime = (records) => {
  //   if (!time) return records;
  //   const from = new Date(time.from.absoluteDate);
  //   const to = new Date(time.to.absoluteDate);
  
  //   return records.filter(record => {
  //     const recordTime = new Date(record.timeframe?.start || record["timestamp"]);
  //     return recordTime >= from && recordTime <= to;
  //   });
  // };  

  // const columns: TableColumn[] = [
  //   {
  //     header: 'Run',
  //     accessor: 'Run',
  //     autoWidth: true,
  //     ratioWidth: 1,
  //   },
  //   {
  //     header: 'Duration',
  //     accessor: 'duration',
  //     autoWidth: true,
  //     ratioWidth: 1,
  //     cell: ({ row }) => {
  //       const data = row.original.duration / 60000000000.00
  //       return (<DataTable.Cell>
  //         {data.toFixed(2) == "0.00" ? (row.original.duration / 1000000000.00).toFixed(2) == "0.00" ? (row.original.duration / 1000000).toFixed(2) + "ms" : (row.original.duration / 1000000000.00).toFixed(2) + "s" : data.toFixed(2) + "mins"}
  //       </DataTable.Cell>)
  //     }
  //   },
  //   {
  //     header: 'Number of Users',
  //     accessor: 'numberOfUsers',
  //     autoWidth: true,
  //     ratioWidth: 1,
  //   },
  //   {
  //     header: 'Pass / Fail',
  //     accessor: 'failureRate',
  //     autoWidth: true,
  //     ratioWidth: 1,
  //     cell: ({ row }) => {
  //       return row.original.failureRate === "0" ? (
  //         <DataTable.Cell style={{ color: 'green' }}>Passed</DataTable.Cell>
  //       ) : (
  //         <DataTable.Cell style={{ color: 'red' }}>Failed</DataTable.Cell>
  //       );
  //     }
  //   },    
  //   // {
  //   //   header: 'Throughput',
  //   //   accessor: 'throughput',
  //   //   ratioWidth: 1,
  //   // },
  // ];

  // return (
  //   <Flex width='100%' flexDirection='column' justifyContent='center' gap={16}>
  //     <Flex width='100%' flexDirection='row' justifyContent='space-between' alignItems="center">
  //       <Heading level={1}>{props.name ? props.name : "Scenario"}</Heading>
  //       <TimeframeSelector value={time} onChange={setTime}/>
  //     </Flex>
  //     <Container>
  //       <CustomTabs
  //         title1="Response Time"
  //         title2="Failure Rate"
  //         title3="CPU Usage"
  //         title4="Throughput"
  //         RTRecords={filterDataByTime(getResponseTimeData(time, responseTimeData).records)}
  //         RTTypes={getResponseTimeData(time, responseTimeData).types}
  //         FRRecords={filterDataByTime(getFailureRateData(time, failureRateData).records)}
  //         FRTypes={getFailureRateData(time, failureRateData).types}
  //         CPURecords={filterDataByTime(getCpuUsageData(time, cpuUsageData).records)}
  //         CPUTypes={getCpuUsageData(time, cpuUsageData).types}
  //         TPRecords={filterDataByTime(getThroughputData(time, throughputData).records)}
  //         TPTypes={getThroughputData(time, throughputData).types}
  //         start_time={time?.from.absoluteDate}
  //         end_time={time?.to.absoluteDate}
  //       />
  //     </Container>
  
  //     <Flex flexDirection="row" alignItems="center">
  //       <Button color="primary" variant="emphasized" width="5%" disabled={selectedRowsData.length === 0 || selectedRowsData.length > 2}>
  //         {selectedRowsData.length > 0 && selectedRowsData.length < 3 ? <Link as={RouterLink} to="/Data">{selectedRowsData.length > 1 ? "Compare" : "Details"}</Link> : "Disabled"}
  //       </Button>
  //       {selectedRowsData.length > 2 && <Text>Maximum 2 rows are allowed for comparison</Text>}
  //     </Flex>
  
  //     <DataTable 
  //       data={filterDataByTime(tableQueryResult.records)}
  //       columns={columns} 
  //       sortable
  //       defaultSelectedRows={selectedRows}
  //       onRowSelectionChange={myRowSelectionChangedListener}
  //       selectableRows
  //       variant={{
  //         rowDensity: 'default',
  //         rowSeparation: 'zebraStripes',
  //         verticalDividers: true,
  //         contained: true,
  //       }}
  //     >
  //       <DataTable.Pagination />
  //     </DataTable>
  //   </Flex>
  // );  

  const [timeframe, setTimeframe] = useState('-72h');
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

  console.log(time);
  

  const matchTags = (props) => {
    const sets = new Map<any, { name: any, id: any }>();
    props.queryResult.data?.records.forEach(record => {
      if (record?.tags && Array.isArray(record?.tags)) {
        for (const tag of record.tags) {
          if (tag && typeof tag === 'string' && props.row.some(transaction => tag.includes(transaction))) {
            // Use id as the unique key in Map
            sets.set(record.id, { name: record.name, id: record.id });
          }
        }
      }
    });
    return sets;
  }

  const error = useDqlQuery({
    body: {
      query: `timeseries error = avg(jmeter.usermetrics.transaction.error), from: "${time?.from.absoluteDate}", to: "${time?.to.absoluteDate}", by: { run, transaction, cycle }
              | sort arrayAvg(error) desc
              | limit 20`
    }
  });

  console.log(error);

  const meantime = useDqlQuery({
    body: {
      query: `timeseries meantime = avg(jmeter.usermetrics.transaction.meantime), from: "${time?.from.absoluteDate}", to: "${time?.to.absoluteDate}", by: { run, transaction, cycle}
              | fieldsRemove meantime
              | summarize by:{timeframe, run, cycle} , transaction = collectArray(transaction)`
    }
  });

  const cpuUsage = useDqlQuery({
    body: {
      query: `timeseries interval: 10m, usage = avg(dt.host.cpu.usage), from: "${time?.from.absoluteDate}", to: "${time?.to.absoluteDate}", by: { dt.entity.host }
              | sort arrayAvg(usage) desc
              | fieldsAdd entityName(dt.entity.host)
              | limit 20`
    }
  });
    

  const columns: TableColumn[] = [
    // {
    //   ...TABLE_EXPANDABLE_DEFAULT_COLUMN
    // },
    {
      header: "Run",
      accessor: "run",
      cell: ({row}) => {
        return (
          <DataTable.Cell>
            {row.original.cycle + row.original.run}
          </DataTable.Cell>
        )
      },
      autoWidth: true,
      ratioWidth: 1
    },
    {
      header: "Input Layer",
      accessor: "input",
      cell: ({row}) => {
        return (
          <DataTable.Cell>
            <TextInput>

            </TextInput>
          </DataTable.Cell>
        )
      },
      autoWidth: true,
      ratioWidth: 2
    },
    {
      header: "Host(s)",
      accessor: "process",
      cell: ({row}) => {
        const hosts = matchTags({queryResult: hostTagsQueryResult(time?.from.absoluteDate, time?.to.absoluteDate), row: row.original.transaction});

        // Convert Map values to an array and map to add external link
        const hostLinks = Array.from(hosts.values()).map(host => ({
          name: host.name,
          link: `https://qkz58401.apps.dynatrace.com/ui/apps/dynatrace.classic.services/ui/entity/${host.id}`
        }));

        return (<DataTable.Cell>
          <ExternalLinks
            links ={hostLinks}
          />
        </DataTable.Cell>)
      },
      autoWidth: true,
      ratioWidth: 1
    },
    {
      header: "Process(es)",
      accessor: "service",
      cell: ({row}) => {
        const processes = matchTags({queryResult: processTagsQueryResult(time?.from.absoluteDate, time?.to.absoluteDate), row: row.original.transaction});

        // Convert Map values to an array and map to add external link
        const processLinks = Array.from(processes.values()).map(process => ({
          name: process.name,
          link: `https://qkz58401.apps.dynatrace.com/ui/apps/dynatrace.classic.technologies/#processgroupdetails;id=${process.id}`
        }));

        return (<DataTable.Cell>
          <ExternalLinks
            links ={processLinks}
          />
        </DataTable.Cell>)
      },
      autoWidth: true,
      ratioWidth: 1
    },
    {
      header: "Service(s)",
      accessor: "transaction",
      cell: ({row}) => {
        const services = matchTags({queryResult: serviceTagsQueryResult(time?.from.absoluteDate, time?.to.absoluteDate), row: row.original.transaction});

        // Convert Map values to an array and map to add external link
        const serviceLinks = Array.from(services.values()).map(service => ({
          name: service.name,
          link: `https://qkz58401.apps.dynatrace.com/ui/apps/dynatrace.classic.services/ui/entity/${service.id}`
        }));

        return (<DataTable.Cell>
          <ExternalLinksWithNumberInput
            links ={serviceLinks}
          />
        </DataTable.Cell>)
      },
      autoWidth: true,
      ratioWidth: 2
    },
    {
      header: "Pass/Fail",
      accessor: "grade",
      cell: ({row}) => {
        return (
          <>
            {error.isLoading && "N/A"}
            {error.data && 
              <DataTable.Cell>

              </DataTable.Cell>
            }
          </>
        )
      },
      autoWidth: true,
      ratioWidth: 1
    }
  ]

  return (
    <Container>
      <Flex justifyContent="end" marginBottom={12}>
        <TimeframeSelector value={time} onChange={setTime} />
      </Flex>
      {meantime.isLoading && <ProgressCircle/>}
      {meantime.data && <DataTable 
        data={meantime.data?.records} 
        columns={columns}
        sortable
        resizable
        variant={{
          rowDensity: 'default',
          rowSeparation: 'zebraStripes',
          verticalDividers: true,
          contained: true,
        }}>
        {/* <DataTable.ExpandableRow>
          {({row}) => {
            return (
              <></>
            )
          }}
        </DataTable.ExpandableRow> */}
        <DataTable.Pagination />
      </DataTable>}
    </Container>
  )
}