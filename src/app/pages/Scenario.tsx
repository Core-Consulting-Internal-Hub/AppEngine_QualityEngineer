import { Button, Container, Flex, ProgressCircle, SkeletonText, Text } from "@dynatrace/strato-components";
import { convertToTimeseries, DataTable, TableColumn, TextInput, TimeframeSelector, TimeframeV2 } from "@dynatrace/strato-components-preview";
import React, {  useState } from "react";
import { useDqlQuery } from "@dynatrace-sdk/react-hooks";
import { ExternalLinks } from "../components/ExternalLinks";
import { cpuUsageQueryResult, errorQueryResult, hostTagsQueryResult, meantimeQueryResult, memoryUsageQueryResult, processTagsQueryResult, serviceTagsQueryResult } from "../Data/QueryResult";
import { subHours } from "date-fns"
import { Link as RouterLink } from 'react-router-dom';
import { ExternalLink, Link } from '@dynatrace/strato-components/typography';
import { getEnvironmentUrl } from "@dynatrace-sdk/app-environment";
import { MatchTags } from "../components/MatchTags";
import { PassCriteria } from "../components/PassCriteria";

export const Scenario = () => {
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

  const run = useDqlQuery({
    body: {
      query: `timeseries meantime = avg(jmeter.usermetrics.transaction.meantime), from: "${time?.from.absoluteDate}", to: "${time?.to.absoluteDate}", by: { run, transaction, cycle }
        | summarize by:{timeframe, run, cycle} , transaction = collectArray(transaction)`
    }
  });

  const columns: TableColumn[] = [
    // {
    //   ...TABLE_EXPANDABLE_DEFAULT_COLUMN
    // },
    {
      header: "Cycle|Run",
      accessor: "run",
      cell: ({row}) => {
        const specificTimeUsage = useDqlQuery({
          body: {
            query: `timeseries meantime = avg(jmeter.usermetrics.transaction.meantime), from: "${time?.from.absoluteDate}", to: "${time?.to.absoluteDate}", by: { run, cycle }
                    | filter run == "${row.original.run}" and cycle == "${row.original.cycle}"`
          }
        }); 

        const datapoints = specificTimeUsage && specificTimeUsage.data && convertToTimeseries(specificTimeUsage.data?.records, specificTimeUsage.data?.types);
        const start = datapoints && datapoints[0].datapoints[0].start?.toISOString();
        const end = datapoints && datapoints[0].datapoints[datapoints.length-1].end?.toISOString();

        return (
          <DataTable.Cell>
            <Link as={RouterLink} to="/details" state={{run: row.original.run, cycle: row.original.cycle, from: start, to: end}}>
              {row.original.cycle.charAt(0).toUpperCase() + row.original.cycle.slice(-2) + "|" + row.original.run.charAt(0).toUpperCase() + row.original.run.slice(-2)}
            </Link>
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
        const hosts = MatchTags({queryResult: hostTagsQueryResult({from: time?.from.absoluteDate, to: time?.to.absoluteDate}), row: row.original.transaction});

        // Convert Map values to an array and map to add external link
        const hostLinks = Array.from(hosts.values()).map(host => ({
          name: host.name,
          link: `${getEnvironmentUrl()}/ui/apps/dynatrace.classic.services/ui/entity/${host.id}`
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
        const processes = MatchTags({queryResult: processTagsQueryResult({from: time?.from.absoluteDate, to: time?.to.absoluteDate}), row: row.original.transaction});

        // Convert Map values to an array and map to add external link
        const processLinks = Array.from(processes.values()).map(process => ({
          name: process.name,
          link: `${getEnvironmentUrl()}/ui/apps/dynatrace.classic.technologies/#processgroupdetails;id=${process.id}`
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
        const services = MatchTags({queryResult: serviceTagsQueryResult({from: time?.from.absoluteDate, to: time?.to.absoluteDate}), row: row.original.transaction});

        let serviceLinks = Array.from(services.values()).map((service, index) => ({
          index: index + 1,
          name: service.name,
          link: `${getEnvironmentUrl()}/ui/apps/dynatrace.classic.services/ui/entity/${service.id}`,
        }));

        return (
          <DataTable.Cell>
            <Flex flexDirection="row">
              <Flex flexDirection="column">
                {serviceLinks.length === 0 ? <Text>N/A</Text> : serviceLinks.map(item => {
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
              <Flex justifyContent="end" alignItems="center">
                <Link as={RouterLink} to="/ServiceFlowCard" state={{services: serviceLinks}}>Details</Link>
              </Flex>
            </Flex>
          </DataTable.Cell>
        )
      },
      autoWidth: true,
      ratioWidth: 2
    },
    {
      header: "Pass/Fail",
      accessor: "grade",
      cell: ({row}) => {
        const error = errorQueryResult({from: row.original.timeframe.start.toISOString(), to: row.original.timeframe.end.toISOString(), run: row.original.run, cycle: row.original.cycle});
        const meantime = meantimeQueryResult({from: row.original.timeframe.start.toISOString(), to: row.original.timeframe.end.toISOString(), run: row.original.run, cycle: row.original.cycle});

        const host = MatchTags({queryResult: hostTagsQueryResult({from: row.original.timeframe.start.toISOString(), to: row.original.timeframe.end.toISOString()}), row: row.original.transaction});
        const cpu = cpuUsageQueryResult({from: row.original.timeframe.start.toISOString(), to: row.original.timeframe.end.toISOString()});
        const memory = memoryUsageQueryResult({from: row.original.timeframe.start.toISOString(), to: row.original.timeframe.end.toISOString()});

        const errorValue = error.data?.records.filter(item => item?.run === row.original.run).map(item =>  item && item.error);
        const timeValue = meantime.data?.records.filter(item => item?.run === row.original.run).map(item => item && item.meantime);
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
        return (
          <>
            {(error.isLoading || meantime.isLoading || cpu.isLoading || memory.isLoading

            ) ? (
              <SkeletonText/>
            ) : (marks && marks.length > 0 ? (
              // Sum the scores in marks
              totalMarks !== (marks.length) ? (
                <DataTable.Cell style={{ color: 'red' }}>Failed</DataTable.Cell>
              ) : (
                <DataTable.Cell style={{ color: 'green' }}>Passed</DataTable.Cell>
              )
            ) : (
              <DataTable.Cell>No Marks</DataTable.Cell>
            ))}
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
      {run.isLoading && <ProgressCircle/>}
      {run.data && <DataTable 
        data={run.data?.records} 
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