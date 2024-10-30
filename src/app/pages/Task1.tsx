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
import { FieldTypeType, QueryResult } from '@dynatrace-sdk/client-query';

export const Task1 = () => {
  const cpuUsage: QueryResult =
    {
      "records": [
        {
          "request_attribute.Easytrade login": "login01",
          "duration": "7930000"
        },
        {
          "request_attribute.Easytrade login": "login02",
          "duration": "6283000"
        },
        {
          "request_attribute.Easytrade login": "login03",
          "duration": "11382000"
        }
      ],
      "metadata": { },
      "types": [
        {
          "mappings": {
            "request_attribute.Easytrade login": {
              "type": FieldTypeType.String
            },
            "duration": {
              "type": FieldTypeType.Duration
            }
          },
          "indexRange": [
            0,
            2
          ]
        }
      ]
    }
  
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
  const throughputQueryResult: QueryResult = 
    {
        "records": [
          {
            "bin(start_time, 15s)": "2024-10-28T15:20:45.000000000+08:00",
            "throughput": 0.8
          },
          {
            "bin(start_time, 15s)": "2024-10-28T15:21:00.000000000+08:00",
            "throughput": 0.2
          },
          {
            "bin(start_time, 15s)": "2024-10-28T15:21:15.000000000+08:00",
            "throughput": 0.4
          },
          {
            "bin(start_time, 15s)": "2024-10-28T15:21:30.000000000+08:00",
            "throughput": 0.8
          },
          {
            "bin(start_time, 15s)": "2024-10-28T15:21:45.000000000+08:00",
            "throughput": 0.4
          },
          {
            "bin(start_time, 15s)": "2024-10-28T15:22:00.000000000+08:00",
            "throughput": 0.6
          },
          {
            "bin(start_time, 15s)": "2024-10-28T15:22:15.000000000+08:00",
            "throughput": 0.4
          },
          {
            "bin(start_time, 15s)": "2024-10-28T15:22:30.000000000+08:00",
            "throughput": 0.6
          },
          {
            "bin(start_time, 15s)": "2024-10-28T15:22:45.000000000+08:00",
            "throughput": 0.4
          },
          {
            "bin(start_time, 15s)": "2024-10-28T15:23:00.000000000+08:00",
            "throughput": 0.8
          },
          {
            "bin(start_time, 15s)": "2024-10-28T15:23:15.000000000+08:00",
            "throughput": 0.4
          },
          {
            "bin(start_time, 15s)": "2024-10-28T15:23:30.000000000+08:00",
            "throughput": 0.4
          },
          {
            "bin(start_time, 15s)": "2024-10-28T15:23:45.000000000+08:00",
            "throughput": 0.8
          },
          {
            "bin(start_time, 15s)": "2024-10-28T15:24:00.000000000+08:00",
            "throughput": 0.4
          },
          {
            "bin(start_time, 15s)": "2024-10-28T15:24:15.000000000+08:00",
            "throughput": 0.2
          },
          {
            "bin(start_time, 15s)": "2024-10-28T15:24:30.000000000+08:00",
            "throughput": 1
          },
          {
            "bin(start_time, 15s)": "2024-10-28T15:24:45.000000000+08:00",
            "throughput": 0.4
          },
          {
            "bin(start_time, 15s)": "2024-10-28T15:25:00.000000000+08:00",
            "throughput": 0.2
          }
        ],
        "metadata": {},
        "types": [
          {
            "mappings": {
              "bin(start_time, 15s)": {
                "type": FieldTypeType.Timestamp
              },
              "throughput": {
                "type": FieldTypeType.Double
              }
            },
            "indexRange": [
              0,
              17
            ]
          }
        ]
      }
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