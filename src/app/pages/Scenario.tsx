import { Button, Container, Flex, ProgressCircle, SkeletonText, Text } from "@dynatrace/strato-components";
import { DataTable, TABLE_EXPANDABLE_DEFAULT_COLUMN, TableColumn, TextInput, TimeframeV2 } from "@dynatrace/strato-components-preview";
import { Heading, Link } from '@dynatrace/strato-components/typography'
import { TimeframeSelector } from "@dynatrace/strato-components-preview";
import { subHours } from 'date-fns';
import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { getCpuUsageData, generateResponseTimeData, getResponseTimeData, tableQueryResult, generateThroughputData, getThroughputData, generateFailureRateData, getFailureRateData } from "../Data/ScenarioData";
import { CustomTabs } from "../components/Tabs";
import { useDqlQuery } from "@dynatrace-sdk/react-hooks";

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

  const error = useDqlQuery({
    body: {
      query: `timeseries error = avg(jmeter.usermetrics.transaction.error), from: ${timeframe}, by: { run, transaction, cycle }
              | sort arrayAvg(error) desc
              | limit 20`
    }
  });

  const meantime = useDqlQuery({
    body: {
      query: `timeseries meantime = avg(jmeter.usermetrics.transaction.meantime), from: ${timeframe}, by: { run, transaction, cycle}
              | fieldsRemove meantime
              | summarize by:{timeframe, run, cycle} , transaction = collectArray(transaction)`
    }
  });

  const cpuUsage = useDqlQuery({
    body: {
      query: `timeseries interval: 10m, usage = avg(dt.host.cpu.usage), from: ${timeframe}, by: { dt.entity.host }
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
      ratioWidth: 1
    },
    {
      header: "Host(s)",
      accessor: "process",
      cell: ({row}) => {
        const host = useDqlQuery({
          body: {
            query: `fetch dt.entity.host, from: ${timeframe}
                    | fieldsAdd tags
                    | filter isNotNull(tags)
                    | fieldsRename host = entity.name`
          }
        });
        const hosts = new Set<any>();
        host.data?.records.forEach(record => {
          if (record?.tags && Array.isArray(record?.tags)) {
            for (const tag of record.tags) {
              if (tag && typeof tag === 'string' && row.original.transaction.some(transaction => tag.includes(transaction))) {
                 hosts .add(record.host);
              }
            }
          }
        });

        return (<DataTable.Cell>{hosts}</DataTable.Cell>)
      },
      autoWidth: true,
      ratioWidth: 1
    },
    {
      header: "Process(es)",
      accessor: "service",
      cell: ({row}) => {
        const process = useDqlQuery({
          body: {
            query: `fetch dt.entity.process_group, from: ${timeframe}
                    | fieldsAdd tags
                    | filter isNotNull(tags)
                    | fieldsRename process = entity.name`
          }
        });

        const processes= new Set<any>();
        process.data?.records.forEach(record => {
          if (record?.tags && Array.isArray(record?.tags)) {
            for (const tag of record.tags) {
              if (tag && typeof tag === 'string' && row.original.transaction.some(transaction => tag.includes(transaction))) {
                 processes.add(record.process);
              }
            }
          }
        });

        return (<DataTable.Cell>{processes}</DataTable.Cell>)
      },
      autoWidth: true,
      ratioWidth: 1
    },
    {
      header: "Service(s)",
      accessor: "transaction",
      cell: ({row}) => {
        const service = useDqlQuery({
          body: {
            query: `fetch dt.entity.service, from: ${timeframe}
                    | fieldsAdd tags
                    | filter isNotNull(tags)
                    | fieldsRename service = entity.name`
          }
        });

        const services= new Set<any>();
        service.data?.records.forEach(record => {
          if (record?.tags && Array.isArray(record?.tags)) {
            for (const tag of record.tags) {
              if (tag && typeof tag === 'string' && row.original.transaction.some(transaction => tag.includes(transaction))) {
                 services.add(record.service);
              }
            }
          }
        });

        return (<DataTable.Cell>{services}</DataTable.Cell>)
      },
      autoWidth: true,
      ratioWidth: 1
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
      {meantime.isLoading && <ProgressCircle/>}
      {meantime.data && <DataTable 
        data={meantime.data?.records} 
        columns={columns}
        sortable
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