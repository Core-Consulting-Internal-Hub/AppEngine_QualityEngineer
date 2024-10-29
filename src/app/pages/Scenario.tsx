import { FieldTypeType, QueryResult } from "@dynatrace-sdk/client-query";
import { Flex } from "@dynatrace/strato-components";
import { convertToTimeseries, Tab, Tabs, TimeseriesChart } from "@dynatrace/strato-components-preview";
import React, { useEffect, useState } from "react";


export const Scenario = () => {
    const [responseTimeData, setResponseTimeData] = useState();
    const [failureRateData, setFailureRateData] = useState();
    const [cpuUsageData, setCpuUsageData] = useState();
    const [throughputData, setThroughputData] = useState();

    const [spans, setSpans] = useState(null);

    useEffect(() => {
        fetch("./assets/Spans.json")
            .then((response) => response.json())
            .then((data) => setSpans(data));
    }, []);

    console.log(spans)

    const responseTimeQueryResult: QueryResult = 
    {
        "records": [
          {
            "timeframe": {
              "start": "2024-10-29T07:15:00.000Z",
              "end": "2024-10-29T09:20:00.000Z"
            },
            "interval": "300000000000",
            "median(duration)": [
              7122000,
              null,
              5776000,
              6904418.218712153,
              6444000,
              null,
              null,
              13749000,
              6731000,
              null,
              6770741.175625163,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              7551000,
              7452000,
              null
            ]
          }
        ],
        "metadata": {},
        "types": [
          {
            "mappings": {
              "timeframe": {
                "type": FieldTypeType.Timeframe
              },
              "interval": {
                "type": FieldTypeType.Duration
              },
              "median(duration)": {
                "type": FieldTypeType.Array,
                "types": [
                  {
                    "mappings": {
                      "element": {
                        "type": FieldTypeType.Double
                      }
                    },
                    "indexRange": [
                      0,
                      24
                    ]
                  }
                ]
              }
            },
            "indexRange": [
              0,
              0
            ]
          }
        ]
    }

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
    

    return (
        <Flex width='100%' flexDirection='column' justifyContent='center' gap={16}>
            <Tabs defaultIndex={0}>
                <Tab title="Response Time">
                    <TimeseriesChart data={convertToTimeseries(responseTimeQueryResult.records, responseTimeQueryResult.types)} variant="line"></TimeseriesChart>
                </Tab>
                {/* <Tab title="Failure Rate">
                    <Flex flexDirection="column">                   
                        <TimeseriesChart data={cpuUsage}></TimeseriesChart>
                    </Flex>
                </Tab>
                <Tab title="CPU usage">
                    <Flex flexDirection="column">                 
                        <TimeseriesChart data={cpuUsage}></TimeseriesChart>
                    </Flex>
                </Tab> */}
                <Tab title="Throughput">
                    <Flex flexDirection="column">
                        <TimeseriesChart data={convertToTimeseries(throughputQueryResult.records, throughputQueryResult.types)} variant="bar"></TimeseriesChart>
                    </Flex>
                </Tab>
            </Tabs>
        </Flex>
    )
}