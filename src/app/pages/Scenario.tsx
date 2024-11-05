import { FieldTypeType, QueryResult } from "@dynatrace-sdk/client-query";
import { Button, Container, Flex } from "@dynatrace/strato-components";
import { convertToTimeseries, DataTable, Tab, TableColumn, Tabs, TimeseriesChart, TimeframeV2 } from "@dynatrace/strato-components-preview";
import { Heading, Link } from '@dynatrace/strato-components/typography'
import { TimeframeSelector } from "@dynatrace/strato-components-preview";
import { subHours } from 'date-fns';
import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

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
        "Run": "run01",
        "responseTime": "7262000",
        "failureRate": "0",
        "cpuUsage": "0",
        "throughput": 0.2
      },
      {
        "Run": "run02",
        "responseTime": "6192000",
        "failureRate": "0",
        "cpuUsage": "0",
        "throughput": 0.2
      },
      {
        "Run": "run03",
        "responseTime": "8923000",
        "failureRate": "0",
        "cpuUsage": "0",
        "throughput": 0.2
      },
      {
        "Run": "run04",
        "responseTime": "6356000",
        "failureRate": "0",
        "cpuUsage": "0",
        "throughput": 0.2
      },
      {
        "Run": "run05",
        "responseTime": "8061000",
        "failureRate": "0",
        "cpuUsage": "0",
        "throughput": 0.2
      },
      {
        "Run": "run06",
        "responseTime": "6636000",
        "failureRate": "0",
        "cpuUsage": "0",
        "throughput": 0.2
      },
      {
        "Run": "run07",
        "responseTime": "5566000",
        "failureRate": "0",
        "cpuUsage": "0",
        "throughput": 0.2
      },
      {
        "Run": "run08",
        "responseTime": "9634000",
        "failureRate": "0",
        "cpuUsage": "0",
        "throughput": 0.2
      },
      {
        "Run": "run09",
        "responseTime": "5713000",
        "failureRate": "0",
        "cpuUsage": "0",
        "throughput": 0.2
      },
      {
        "Run": "run10",
        "responseTime": "6904418",
        "failureRate": "0",
        "cpuUsage": "0",
        "throughput": 0.4
      },
      {
        "Run": "run11",
        "responseTime": "6197165",
        "failureRate": "0",
        "cpuUsage": "0",
        "throughput": 0.4
      },
      {
        "Run": "run12",
        "responseTime": "6864000",
        "failureRate": "0",
        "cpuUsage": "0",
        "throughput": 0.2
      },
      {
        "Run": "run13",
        "responseTime": "7053000",
        "failureRate": "0",
        "cpuUsage": "0",
        "throughput": 0.2
      },
      {
        "Run": "run14",
        "responseTime": "7274000",
        "failureRate": "0",
        "cpuUsage": "0",
        "throughput": 0.2
      },
      {
        "Run": "run15",
        "responseTime": "15052000",
        "failureRate": "0",
        "cpuUsage": "0",
        "throughput": 0.2
      },
      {
        "Run": "run16",
        "responseTime": "11161262",
        "failureRate": "0",
        "cpuUsage": "0",
        "throughput": 0.4
      },
      {
        "Run": "run17",
        "responseTime": "11736000",
        "failureRate": "0",
        "cpuUsage": "0",
        "throughput": 0.2
      },
      {
        "Run": "run18",
        "responseTime": "7130000",
        "failureRate": "0",
        "cpuUsage": "0",
        "throughput": 0.2
      },
      {
        "Run": "run19",
        "responseTime": "9777383",
        "failureRate": "0",
        "cpuUsage": "0",
        "throughput": 0.4
      },
      {
        "Run": "run20",
        "responseTime": "7331000",
        "failureRate": "0",
        "cpuUsage": "0",
        "throughput": 0.2
      },
      {
        "Run": "run21",
        "responseTime": "7277000",
        "failureRate": "0",
        "cpuUsage": "0",
        "throughput": 0.2
      },
      {
        "Run": "run22",
        "responseTime": "7369712",
        "failureRate": "0",
        "cpuUsage": "0",
        "throughput": 0.4
      },
      {
        "Run": "run23",
        "responseTime": "6471536",
        "failureRate": "0",
        "cpuUsage": "0",
        "throughput": 0.4
      },
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
      header: 'Run',
      accessor: 'Run',
      ratioWidth: 1,
    },
    {
      header: 'Response Time',
      accessor: 'responseTime',
      ratioWidth: 1,
    },
    {
      header: 'Failure Rate',
      accessor: 'failureRate',
      ratioWidth: 1,
    },
    {
      header: 'CPU usage',
      accessor: 'cpuUsage',
      ratioWidth: 1,
    },
    {
      header: 'Throughput',
      accessor: 'throughput',
      ratioWidth: 1,
    },
  ];

  return (
    <Flex width='100%' flexDirection='column' justifyContent='center' gap={16}>
      <Flex width='100%' flexDirection='row' justifyContent='space-between' alignItems="center">
        <Heading level={1}>{props.name ? props.name : "Scenario"}</Heading>
        <TimeframeSelector value={time} onChange={setTime}/>
      </Flex>
      <Container>
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
      </Container>
      <Flex>
        <Button color="primary" variant="emphasized" width="5%" disabled={selectedRowsData.length == 0}>
          {selectedRowsData.length != 0 ? <Link as={RouterLink} to="/Data">{selectedRowsData.length > 1 ? "Compare" : "Details"}</Link> : "Disabled"}
        </Button>
      </Flex>

      <DataTable 
        data={tableQueryResult.records} 
        columns={columns} 
        sortable
        defaultSelectedRows={selectedRows}
        onRowSelectionChange={myRowSelectionChangedListener}
        selectableRows
      >
        <DataTable.Pagination />
      </DataTable>
    </Flex>
  )
}