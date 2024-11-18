import React, { useState } from 'react';
import { Container, Flex } from '@dynatrace/strato-components/layouts';
import { TitleBar } from '@dynatrace/strato-components-preview/layouts';
import {
  convertToColumns,
  convertToTimeseries,
  getDimensions,
} from '@dynatrace/strato-components-preview/conversion-utilities';
import {
  DataTable,
  TableColumn,
} from '@dynatrace/strato-components-preview/tables';
import { Heading } from '@dynatrace/strato-components';
import { ProgressCircle } from '@dynatrace/strato-components';
import { Timeseries, TimeseriesChart } from '@dynatrace/strato-components-preview/charts';
import { FieldTypeType, QueryResult } from '@dynatrace-sdk/client-query';
import { subHours } from 'date-fns';
import { Tab, Tabs, TimeframeSelector, TimeframeV2 } from '@dynatrace/strato-components-preview';
import { responseTimeQueryResult, failureRateQueryResult, cpuUsageQueryResult, throughputQueryResult, tableQueryResult, columns} from '../data/samplejson.ts';

export const DetailedPage = (props) => {
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

  return (
    <Flex width="100%" flexDirection="row" justifyContent="center" gap={16} flexWrap="wrap" >
      <Flex width="100%" flexDirection="column" justifyContent="center">
        <Flex width='100%' flexDirection='row' justifyContent='space-between' alignItems="center">
          <Heading level={1}>{props.name ? props.name : "Scenario"}</Heading>
          <TimeframeSelector value={time} onChange={setTime} />
        </Flex>
        <Tabs defaultIndex={0}>
          <Tab title="Response Time">
            <TimeseriesChart data={convertToTimeseries(responseTimeQueryResult.records, responseTimeQueryResult.types)} variant="bar"></TimeseriesChart>
          </Tab>
          <Tab title="Failure Rate">
            <Flex flexDirection="column">
              <TimeseriesChart data={convertToTimeseries(failureRateQueryResult.records, failureRateQueryResult.types)} variant="line"></TimeseriesChart>
            </Flex>
          </Tab>
          <Tab title="CPU usage">
            <Flex flexDirection="column">
              <TimeseriesChart data={convertToTimeseries(cpuUsageQueryResult.records, cpuUsageQueryResult.types)} variant="area"></TimeseriesChart>
            </Flex>
          </Tab>
          <Tab title="Throughput">
            <Flex flexDirection="column">
              <TimeseriesChart data={convertToTimeseries(throughputQueryResult.records, throughputQueryResult.types)} variant="bar"></TimeseriesChart>
            </Flex>
          </Tab>
        </Tabs>
      </Flex>
      <Flex width="100%" flexDirection="column" justifyContent="center">
        <DataTable data={tableQueryResult.records} columns={columns} sortable resizable>
          <DataTable.Pagination />
          <DataTable.Toolbar />
        </DataTable>
      </Flex>
    </Flex>

  );
};