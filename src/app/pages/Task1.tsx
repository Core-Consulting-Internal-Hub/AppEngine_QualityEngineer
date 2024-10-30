import React, { Profiler } from 'react';
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
import { useDqlQuery } from '@dynatrace-sdk/react-hooks';
import { Heading } from '@dynatrace/strato-components';
import { ProgressCircle } from '@dynatrace/strato-components';
import { Timeseries, TimeseriesChart } from '@dynatrace/strato-components-preview/charts';

export const Task1 = () => {
  const cpuUsage: Timeseries[] = [
    {
      name: ['pl1l-vh48.example.com', 'HYPERVISOR-CC7CFC844F787622'],
      unit: 'percent',
      datapoints: [
        {
          start: new Date('Tue, 05 Apr 2022 12:18:00 UTC'),
          end: new Date('Tue, 12 Apr 2022 12:19:00 UTC'),
          value: 51,
        },
        {
          start: new Date('Tue, 12 Apr 2022 12:19:00 UTC'),
          end: new Date('Tue, 19 Apr 2022 12:20:00 UTC'),
          value: 49.29,
        },
        {
          start: new Date('Tue, 19 Apr 2022 12:20:00 UTC'),
          end: new Date('Tue, 26 Apr 2022 12:21:00 UTC'),
          value: 51.98,
        }
      ]
    }
  ];
  
  const responseTime = useDqlQuery({
    body: {
      query:
        ` fetch spans
        | filter request_attribute.Easytrade login == "andrew_wall"
        | filter isNotNull(request_attribute.Easytrade login)
        | makeTimeseries median(duration), by: {"Median Duration (ms)"}, interval: 10m
        `,
    },
  });
  const throughput = useDqlQuery({
    body: {
      query:
        ` fetch spans
        | filter isNotNull(\`request_attribute.Easytrade login\`)
        | makeTimeseries count(), by: {bin(start_time, 5m)}, interval: 15s 
        `,
    },
  });
  const failure = useDqlQuery({
    body: {
      query:
        ` fetch spans
      | filter isNotNull(\`request_attribute.Easytrade login\`)
      | summarize 
          failureRate = (countif(http.response.status_code != 200) / count()) * 100,
          by: {bin(start_time, 15s)}
      `,
    },
  });

  return (
    <Flex
      width="100%"
      flexDirection="row"
      justifyContent="center"
      gap={16}
      flexWrap="wrap"  // Enables wrapping to the next row
    >
      <Flex
        flexDirection="column"
        flexBasis="calc(50% - 16px)"  // Makes each element take 50% width (minus gap)
        maxWidth="calc(50% - 16px)"  // Ensures elements don’t exceed row width
      >
        <Heading as="h3">CPU Usage</Heading>
        {result.isLoading && <ProgressCircle />}
        {result.data && (
          <Container>
            <TimeseriesChart
              data={convertToTimeseries(result.data.records, result.data.types)}
              gapPolicy="connect"
              variant="line"
            />
          </Container>
        )}
      </Flex>

      <Flex
        flexDirection="column"
        flexBasis="calc(50% - 16px)"
        maxWidth="calc(50% - 16px)"
      >
        <Heading as="h3">Response Time</Heading>
        {result.isLoading && <ProgressCircle />}
        {result.data && (
          <Container>
            <TimeseriesChart
              data={convertToTimeseries(result.data.records, result.data.types)}
              gapPolicy="connect"
              variant="line"
            />
          </Container>
        )}
      </Flex>

      <Flex
        flexDirection="column"
        flexBasis="calc(50% - 16px)"
        maxWidth="calc(50% - 16px)"
      >
        <Heading as="h3">Throughput</Heading>
        {result.isLoading && <ProgressCircle />}
        {result.data && (
          <Container>
            <TimeseriesChart
              data={convertToTimeseries(result.data.records, result.data.types)}
              gapPolicy="connect"
              variant="line"
            />
          </Container>
        )}
      </Flex>

      <Flex
        flexDirection="column"
        flexBasis="calc(50% - 16px)"
        maxWidth="calc(50% - 16px)"
      >
        <Heading as="h3">Failure Rate</Heading>
        {failure.isLoading && <ProgressCircle />}
        {failure.data && (
          <Container>
            <TimeseriesChart
              data={convertToTimeseries(failure.data.records, failure.data.types)}
              gapPolicy="connect"
              variant="line"
            />
          </Container>
        )}
      </Flex>
    </Flex>

  );
};