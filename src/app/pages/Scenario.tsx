import { FieldTypeType, QueryResult } from "@dynatrace-sdk/client-query";
import { Flex } from "@dynatrace/strato-components";
import { convertToTimeseries, DataTable, FieldSet, Tab, TableColumn, Tabs, TimeseriesChart } from "@dynatrace/strato-components-preview";
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

  const failureRateQueryResult: QueryResult = 
  {
    "records": [
      {
        "bin(start_time, 15s)": "2024-10-30T10:29:15.000000000+08:00",
        "failureRate": "0"
      },
      {
        "bin(start_time, 15s)": "2024-10-30T10:29:30.000000000+08:00",
        "failureRate": "0"
      },
      {
        "bin(start_time, 15s)": "2024-10-30T10:29:45.000000000+08:00",
        "failureRate": "0"
      },
      {
        "bin(start_time, 15s)": "2024-10-30T10:30:00.000000000+08:00",
        "failureRate": "0"
      },
      {
        "bin(start_time, 15s)": "2024-10-30T10:30:15.000000000+08:00",
        "failureRate": "0"
      },
      {
        "bin(start_time, 15s)": "2024-10-30T10:30:30.000000000+08:00",
        "failureRate": "0"
      },
      {
        "bin(start_time, 15s)": "2024-10-30T10:30:45.000000000+08:00",
        "failureRate": "0"
      },
      {
        "bin(start_time, 15s)": "2024-10-30T10:31:00.000000000+08:00",
        "failureRate": "0"
      },
      {
        "bin(start_time, 15s)": "2024-10-30T10:31:15.000000000+08:00",
        "failureRate": "0"
      },
      {
        "bin(start_time, 15s)": "2024-10-30T10:31:30.000000000+08:00",
        "failureRate": "0"
      },
      {
        "bin(start_time, 15s)": "2024-10-30T10:31:45.000000000+08:00",
        "failureRate": "0"
      },
      {
        "bin(start_time, 15s)": "2024-10-30T10:32:15.000000000+08:00",
        "failureRate": "0"
      },
      {
        "bin(start_time, 15s)": "2024-10-30T10:32:30.000000000+08:00",
        "failureRate": "0"
      },
      {
        "bin(start_time, 15s)": "2024-10-30T10:32:45.000000000+08:00",
        "failureRate": "0"
      },
      {
        "bin(start_time, 15s)": "2024-10-30T10:33:00.000000000+08:00",
        "failureRate": "0"
      },
      {
        "bin(start_time, 15s)": "2024-10-30T10:33:15.000000000+08:00",
        "failureRate": "0"
      },
      {
        "bin(start_time, 15s)": "2024-10-30T10:33:30.000000000+08:00",
        "failureRate": "0"
      }
    ],
    "metadata": {},
    "types": [
      {
        "mappings": {
          "bin(start_time, 15s)": {
            "type": FieldTypeType.Timestamp
          },
          "failureRate": {
            "type": FieldTypeType.Long
          }
        },
        "indexRange": [
          0,
          16
        ]
      }
    ]
  }

  const cpuUsageQueryResult: QueryResult = 
  {
    "records": [
      {
        "timeframe": {
          "start": "2024-10-30T02:18:45.000Z",
          "end": "2024-10-30T02:24:00.000Z"
        },
        "interval": "300000000000",
        "avg(span.timing.cpu)": [
          null,
          0,
          17,
          27,
          38,
          25,
          101,
          null,
          null,
          11,
          56,
          3,
          null,
          36,
          77,
          50,
          0,
          7,
          0,
          null,
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
          "avg(span.timing.cpu)": {
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
                  20
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
  
  const tableQueryResult: QueryResult = 
  {
    "records": [
      {
        "easyTradeLogin": "amy_price",
        "responseTime": "7262000",
        "failureRate": "0",
        "cpuUsage": "0",
        "throughput": 0.2
      },
      {
        "easyTradeLogin": "andrew_wall",
        "responseTime": "6192000",
        "failureRate": "0",
        "cpuUsage": "0",
        "throughput": 0.2
      },
      {
        "easyTradeLogin": "ashley_may",
        "responseTime": "8923000",
        "failureRate": "0",
        "cpuUsage": "0",
        "throughput": 0.2
      },
      {
        "easyTradeLogin": "catherine_rojas",
        "responseTime": "6356000",
        "failureRate": "0",
        "cpuUsage": "0",
        "throughput": 0.2
      },
      {
        "easyTradeLogin": "francis_cunningham",
        "responseTime": "8061000",
        "failureRate": "0",
        "cpuUsage": "0",
        "throughput": 0.2
      },
      {
        "easyTradeLogin": "hailey_jimenez",
        "responseTime": "6636000",
        "failureRate": "0",
        "cpuUsage": "0",
        "throughput": 0.2
      },
      {
        "easyTradeLogin": "harry_harris",
        "responseTime": "5566000",
        "failureRate": "0",
        "cpuUsage": "0",
        "throughput": 0.2
      },
      {
        "easyTradeLogin": "james_norton",
        "responseTime": "9634000",
        "failureRate": "0",
        "cpuUsage": "0",
        "throughput": 0.2
      },
      {
        "easyTradeLogin": "jeremy_pollard",
        "responseTime": "5713000",
        "failureRate": "0",
        "cpuUsage": "0",
        "throughput": 0.2
      },
      {
        "easyTradeLogin": "jessica_petty",
        "responseTime": "6904418",
        "failureRate": "0",
        "cpuUsage": "0",
        "throughput": 0.4
      },
      {
        "easyTradeLogin": "jessica_salas",
        "responseTime": "6197165",
        "failureRate": "0",
        "cpuUsage": "0",
        "throughput": 0.4
      },
      {
        "easyTradeLogin": "joshua_swanson",
        "responseTime": "6864000",
        "failureRate": "0",
        "cpuUsage": "0",
        "throughput": 0.2
      },
      {
        "easyTradeLogin": "julie_carpenter",
        "responseTime": "7053000",
        "failureRate": "0",
        "cpuUsage": "0",
        "throughput": 0.2
      },
      {
        "easyTradeLogin": "keith_holt",
        "responseTime": "7274000",
        "failureRate": "0",
        "cpuUsage": "0",
        "throughput": 0.2
      },
      {
        "easyTradeLogin": "kenneth_sutton",
        "responseTime": "15052000",
        "failureRate": "0",
        "cpuUsage": "0",
        "throughput": 0.2
      },
      {
        "easyTradeLogin": "kimberly_key",
        "responseTime": "11161262",
        "failureRate": "0",
        "cpuUsage": "0",
        "throughput": 0.4
      },
      {
        "easyTradeLogin": "madison_baldwin",
        "responseTime": "11736000",
        "failureRate": "0",
        "cpuUsage": "0",
        "throughput": 0.2
      },
      {
        "easyTradeLogin": "martin_obrien",
        "responseTime": "7130000",
        "failureRate": "0",
        "cpuUsage": "0",
        "throughput": 0.2
      },
      {
        "easyTradeLogin": "mary_fischer",
        "responseTime": "9777383",
        "failureRate": "0",
        "cpuUsage": "0",
        "throughput": 0.4
      },
      {
        "easyTradeLogin": "megan_benton",
        "responseTime": "7331000",
        "failureRate": "0",
        "cpuUsage": "0",
        "throughput": 0.2
      },
      {
        "easyTradeLogin": "michael_copeland",
        "responseTime": "7277000",
        "failureRate": "0",
        "cpuUsage": "0",
        "throughput": 0.2
      },
      {
        "easyTradeLogin": "monique_rice",
        "responseTime": "7369712",
        "failureRate": "0",
        "cpuUsage": "0",
        "throughput": 0.4
      },
      {
        "easyTradeLogin": "nicole_solis",
        "responseTime": "6471536",
        "failureRate": "0",
        "cpuUsage": "0",
        "throughput": 0.4
      },
      {
        "easyTradeLogin": "paige_valentine",
        "responseTime": "10371000",
        "failureRate": "0",
        "cpuUsage": "0",
        "throughput": 0.2
      },
      {
        "easyTradeLogin": "patricia_fisher",
        "responseTime": "7777000",
        "failureRate": "0",
        "cpuUsage": "0",
        "throughput": 0.2
      },
      {
        "easyTradeLogin": "paula_marshall",
        "responseTime": "6922000",
        "failureRate": "0",
        "cpuUsage": "0",
        "throughput": 0.2
      },
      {
        "easyTradeLogin": "richard_hart",
        "responseTime": "6959000",
        "failureRate": "0",
        "cpuUsage": "0",
        "throughput": 0.2
      },
      {
        "easyTradeLogin": "robert_lopez",
        "responseTime": "6809000",
        "failureRate": "0",
        "cpuUsage": "0",
        "throughput": 0.2
      },
      {
        "easyTradeLogin": "robin_garcia",
        "responseTime": "8631000",
        "failureRate": "0",
        "cpuUsage": "0",
        "throughput": 0.2
      },
      {
        "easyTradeLogin": "sandra_schneider",
        "responseTime": "6611000",
        "failureRate": "0",
        "cpuUsage": "0",
        "throughput": 0.2
      },
      {
        "easyTradeLogin": "sean_williams",
        "responseTime": "7462000",
        "failureRate": "0",
        "cpuUsage": "0",
        "throughput": 0.2
      },
      {
        "easyTradeLogin": "stephanie_henson",
        "responseTime": "8474000",
        "failureRate": "0",
        "cpuUsage": "0",
        "throughput": 0.2
      },
      {
        "easyTradeLogin": "teresa_leon",
        "responseTime": "5850000",
        "failureRate": "0",
        "cpuUsage": "0",
        "throughput": 0.2
      },
      {
        "easyTradeLogin": "terri_phelps",
        "responseTime": "6236000",
        "failureRate": "0",
        "cpuUsage": "0",
        "throughput": 0.2
      },
      {
        "easyTradeLogin": "tonya_palmer",
        "responseTime": "7008342",
        "failureRate": "0",
        "cpuUsage": "0",
        "throughput": 0.4
      },
      {
        "easyTradeLogin": "tracy_wright",
        "responseTime": "7851000",
        "failureRate": "0",
        "cpuUsage": "0",
        "throughput": 0.2
      },
      {
        "easyTradeLogin": "veronica_miller",
        "responseTime": "7555000",
        "failureRate": "0",
        "cpuUsage": "0",
        "throughput": 0.2
      }
    ],
    "metadata": {},
    "types": [
      {
        "mappings": {
          "request_attribute.Easytrade login": {
            "type": FieldTypeType.String
          },
          "responseTime": {
            "type": FieldTypeType.Duration
          },
          "failureRate": {
            "type": FieldTypeType.Long
          },
          "cpuUsage": {
            "type": FieldTypeType.Duration
          },
          "throughput": {
            "type": FieldTypeType.Double
          }
        },
        "indexRange": [
          0,
          33
        ]
      }
    ]
  }

  const columns: TableColumn[] = [
    {
      header: 'EasyTrade Login',
      accessor: 'easyTradeLogin',
      autoWidth: true,
    },
    {
      header: 'Response Time',
      accessor: 'responseTime',
      autoWidth: true,
    },
    {
      header: 'Failure Rate',
      accessor: 'failureRate',
      autoWidth: true,
    },
    {
      header: 'CPU usage',
      accessor: 'cpuUsage',
      autoWidth: true,
    },
    {
      header: 'Throughput',
      accessor: 'throughput',
      autoWidth: true,
    },
  ];

  return (
    <Flex width='100%' flexDirection='column' justifyContent='center' gap={16}>
      <Tabs defaultIndex={0}>
        <Tab title="Response Time">
          <TimeseriesChart data={convertToTimeseries(responseTimeQueryResult.records, responseTimeQueryResult.types)} variant="line"></TimeseriesChart>
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
      <DataTable data={tableQueryResult.records} columns={columns} sortable resizable>
      </DataTable>
    </Flex>
  )
}