import { FieldTypeType, QueryResult } from "@dynatrace-sdk/client-query"

export const responseTimeQueryResult: QueryResult = 
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

export const failureRateQueryResult: QueryResult = 
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

export const cpuUsageQueryResult: QueryResult = 
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

export const throughputQueryResult: QueryResult = 
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

export const tableQueryResult: QueryResult = 
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