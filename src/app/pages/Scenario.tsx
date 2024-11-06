import { FieldTypeType, QueryResult } from "@dynatrace-sdk/client-query";
import { Button, Container, Flex, Text } from "@dynatrace/strato-components";
import { convertToTimeseries, DataTable, Tab, TableColumn, Tabs, TimeseriesChart, TimeframeV2 } from "@dynatrace/strato-components-preview";
import { Heading, Link } from '@dynatrace/strato-components/typography'
import { TimeframeSelector } from "@dynatrace/strato-components-preview";
import { subHours } from 'date-fns';
import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { cpuUsageQueryResult, failureRateQueryResult, responseTimeQueryResult, tableQueryResult, throughputQueryResult } from "../Data/ScenarioData";
import { CustomTabs } from "../components/Tabs";

export const Scenario = (props) => {
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

  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
  const [selectedRowsData, setSelectedRowsData] = useState([]);

  const myRowSelectionChangedListener = (
    SelectedRows: Record<string, boolean>,
    selectedRowsData: [],
    trigger: 'user' | 'internal'
  ) => {
    setSelectedRows(SelectedRows)
    setSelectedRowsData(selectedRowsData);
  };

  console.log(selectedRowsData)

  const columns: TableColumn[] = [
    {
      header: 'Run',
      accessor: 'Run',
      ratioWidth: 1,
    },
    {
      header: 'Duration',
      accessor: 'duration',
      ratioWidth: 1,
    },
    {
      header: 'Number of Users',
      accessor: 'numberOfUsers',
      ratioWidth: 1,
    },
    {
      header: 'Pass / Fail',
      accessor: 'failureRate',
      ratioWidth: 1,
      cell: ({ row }) => {
        return row.original.failureRate === "0" ? (
          <DataTable.Cell style={{ color: 'green' }}>Passed</DataTable.Cell>
        ) : (
          <DataTable.Cell style={{ color: 'red' }}>Failed</DataTable.Cell>
        );
      }
    },    
    // {
    //   header: 'Throughput',
    //   accessor: 'throughput',
    //   ratioWidth: 1,
    // },
  ];

  return (
    <Flex width='100%' flexDirection='column' justifyContent='center' gap={16}>
      <Flex width='100%' flexDirection='row' justifyContent='space-between' alignItems="center">
        <Heading level={1}>{props.name ? props.name : "Scenario"}</Heading>
        <TimeframeSelector value={time} onChange={setTime}/>
      </Flex>
      <Container>
        <CustomTabs
          title1="Response Time"
          title2="Failure Rate"
          title3="CPU Usage"
          title4="Throughput"
          RTRecords={responseTimeQueryResult.records}
          RTTypes={responseTimeQueryResult.types}
          FRRecords={failureRateQueryResult.records}
          FRTypes={failureRateQueryResult.types}
          CPURecords={cpuUsageQueryResult.records}
          CPUTypes={cpuUsageQueryResult.types}
          TPRecords={throughputQueryResult.records}
          TPTypes={throughputQueryResult.types}
        />
      </Container>
      <Flex flexDirection="row" alignItems="center">
        <Button color="primary" variant="emphasized" width="5%" disabled={selectedRowsData.length == 0 || selectedRowsData.length > 2}>
          {selectedRowsData.length > 0 &&  selectedRowsData.length < 3 ? <Link as={RouterLink} to="/Data">{selectedRowsData.length > 1 ? "Compare" : "Details"}</Link> : "Disabled"}
        </Button>
        {selectedRowsData.length > 2 && <Text>Maximum 2 rows are allowes for comparison</Text>}
      </Flex>

      <DataTable 
        data={tableQueryResult.records} 
        columns={columns} 
        sortable
        defaultSelectedRows={selectedRows}
        onRowSelectionChange={myRowSelectionChangedListener}
        selectableRows
        variant={{
          rowDensity: 'default',
          rowSeparation: 'zebraStripes',
          verticalDividers: true,
          contained: true,}}
      >
        <DataTable.Pagination />
      </DataTable>
    </Flex>
  )
}