import { FieldTypeType, QueryResult } from "@dynatrace-sdk/client-query";
import { Button, Container, Flex, Text } from "@dynatrace/strato-components";
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
        "duration": "7262000",
        "numberOfUsers": "0",
        "failureRate": "0",
        "throughput": 0.2
      },
      {
        "Run": "run02",
        "duration": "6192000",
        "numberOfUsers": "0",
        "failureRate": "0",
        "throughput": 0.2
      },
      {
        "Run": "run03",
        "duration": "8923000",
        "numberOfUsers": "0",
        "failureRate": "0",
        "throughput": 0.2
      },
      {
        "Run": "run04",
        "duration": "6356000",
        "numberOfUsers": "0",
        "failureRate": "0",
        "throughput": 0.2
      },
      {
        "Run": "run05",
        "duration": "8061000",
        "numberOfUsers": "0",
        "failureRate": "1",
        "throughput": 0.2
      },
    ],
    "metadata": {},
    "types": [
      {
        "mappings": {
          "request_attribute.Easytrade login": {
            "type": FieldTypeType.String
          },
          "duration": {
            "type": FieldTypeType.Duration
          },
          "numberOfUsers": {
            "type": FieldTypeType.Long
          },
          "failureRate": {
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