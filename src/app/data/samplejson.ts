import { FieldTypeType, QueryResult } from '@dynatrace-sdk/client-query';
import { TableColumn } from '@dynatrace/strato-components-preview';
import Colors from '@dynatrace/strato-design-tokens/colors';

export const cpuUsageQueryResult: QueryResult =
{
  "records": [
    {
      "timeframe": {
        "start": "2024-11-04T05:40:00.000Z",
        "end": "2024-11-04T06:50:00.000Z"
      },
      "interval": "600000000000",
      "\"CPU usage\"": "CPU usage",
      "easyTravelTransaction": "login01",
      "avg(span.timing.cpu)": [
        null,
        0,
        null,
        null,
        null,
        null,
        0
      ]
    },
    {
      "timeframe": {
        "start": "2024-11-04T05:40:00.000Z",
        "end": "2024-11-04T06:50:00.000Z"
      },
      "interval": "600000000000",
      "\"CPU usage\"": "CPU usage",
      "easyTravelTransaction": "login02",
      "avg(span.timing.cpu)": [
        0,
        null,
        null,
        null,
        null,
        0,
        0
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
        "\"CPU usage\"": {
          "type": FieldTypeType.String
        },
        "easyTravelTransaction": {
          "type": FieldTypeType.String
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
                6
              ]
            }
          ]
        }
      },
      "indexRange": [
        0,
        1
      ]
    }
  ]
}

export const responseTimeQueryResult: QueryResult =
{
  "records": [
    {
      "timeframe": {
        "start": "2024-11-04T05:20:00.000Z",
        "end": "2024-11-04T06:30:00.000Z"
      },
      "interval": "600000000000",
      "\"Median Duration (ms)\"": "Median Duration (ms)",
      "easyTravelTransaction": "login01",
      "median(duration)": [
        null,
        6057000,
        null,
        6779000,
        null,
        null,
        null
      ]
    },
    {
      "timeframe": {
        "start": "2024-11-04T05:20:00.000Z",
        "end": "2024-11-04T06:30:00.000Z"
      },
      "interval": "600000000000",
      "\"Median Duration (ms)\"": "Median Duration (ms)",
      "easyTravelTransaction": "login02",
      "median(duration)": [
        6692000,
        7217000,
        6803000,
        null,
        null,
        null,
        null
      ]
    }
  ],
  "metadata": {
  },
  "types": [
    {
      "mappings": {
        "timeframe": {
          "type": FieldTypeType.Timeframe
        },
        "interval": {
          "type": FieldTypeType.Duration
        },
        "\"Median Duration (ms)\"": {
          "type": FieldTypeType.String
        },
        "easyTravelTransaction": {
          "type": FieldTypeType.String
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
                6
              ]
            }
          ]
        }
      },
      "indexRange": [
        0,
        1
      ]
    }
  ]
}

export const throughputQueryResult: QueryResult =
{
  "records": [
    {
      "timeframe": {
        "start": "2024-11-04T05:50:00.000Z",
        "end": "2024-11-04T07:00:00.000Z"
      },
      "interval": "600000000000",
      "\"ThroughPut\"": "ThroughPut",
      "easyTravelTransaction": "login01",
      "count()": [
        1,
        null,
        null,
        null,
        null,
        1,
        null
      ]
    },
    {
      "timeframe": {
        "start": "2024-11-04T05:50:00.000Z",
        "end": "2024-11-04T07:00:00.000Z"
      },
      "interval": "600000000000",
      "\"ThroughPut\"": "ThroughPut",
      "easyTravelTransaction": "login02",
      "count()": [
        null,
        null,
        null,
        null,
        1,
        1,
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
        "\"ThroughPut\"": {
          "type": FieldTypeType.String
        },
        "easyTravelTransaction": {
          "type": FieldTypeType.String
        },
        "count()": {
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
                6
              ]
            }
          ]
        }
      },
      "indexRange": [
        0,
        1
      ]
    }
  ]
}

export const failureRateQueryResult: QueryResult =
{
  "records": [
    {
      "easyTravelTransaction": "login01",
      "bin(start_time, 15s)": "2024-11-04T14:40:15.000000000+08:00",
      "failureRate": "0"
    },
    {
      "easyTravelTransaction": "login02",
      "bin(start_time, 15s)": "2024-11-04T14:36:15.000000000+08:00",
      "failureRate": "0"
    },
    {
      "easyTravelTransaction": "login02",
      "bin(start_time, 15s)": "2024-11-04T14:44:15.000000000+08:00",
      "failureRate": "0"
    }
  ],
  "metadata": {},
  "types": [
    {
      "mappings": {
        "easyTravelTransaction": {
          "type": FieldTypeType.String
        },
        "bin(start_time, 15s)": {
          "type": FieldTypeType.Timestamp
        },
        "failureRate": {
          "type": FieldTypeType.Long
        }
      },
      "indexRange": [
        0,
        2
      ]
    }
  ]
}

export const tableQueryResult: QueryResult =
{
  "records": [
    {
      "easyTravelTransaction": "login01",
      "responseTime": 12558974,
      "failureRate": 0,
      "cpuUsage": 0,
      "throughput": 0.4
    },
    {
      "easyTravelTransaction": "login02",
      "responseTime": 7870052,
      "failureRate": 0,
      "cpuUsage": 0,
      "throughput": 0.4
    }
  ],
  "metadata": {},
  "types": [
    {
      "mappings": {
        "easyTravelTransaction": {
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
        1
      ]
    }
  ]
}

export const columns: TableColumn[] = [
  {
    header: 'txn',
    accessor: 'easyTravelTransaction',
    autoWidth: true,
  },
  {
    header: 'Response Time',
    accessor: 'responseTime',
    autoWidth: true,
    columnType: 'meterbar',
    config: {
      color: Colors.Charts.Categorical.Color15.Default,
      showTooltip: true,
      min: 0,
      max: 10000000,
      thresholds: [
        {
          value: 100000,
          color: Colors.Charts.Threshold.Good.Default,
          name: 'Good',
        },
        {
          value: 1000000,
          color: Colors.Charts.Threshold.Warning.Default,
          name: 'Warning',
        },
        {
          value: 10000000,
          color: Colors.Charts.Threshold.Bad.Default,
          name: 'Bad',
        },
      ],
    },
  },
  {
    header: 'Failure Rate',
    accessor: 'failureRate',
    autoWidth: true,
    columnType: 'meterbar',
    config: {
      color: Colors.Charts.Categorical.Color15.Default,
      showTooltip: true,
      min: 0,
      max: 10,
      thresholds: [
        {
          value: 0, //should be changed according to the quantity of the vu
          color: Colors.Charts.Threshold.Good.Default,
          name: 'Good',
        },
        {
          value: 100,
          color: Colors.Charts.Threshold.Warning.Default,
          name: 'Warning',
        },
        {
          value: 1000,
          color: Colors.Charts.Threshold.Bad.Default,
          name: 'Bad',
        },
      ],
    },
  },
  {
    header: 'CPU usage',
    accessor: 'cpuUsage',
    autoWidth: true,
    columnType: 'meterbar',
    config: {
      color: Colors.Charts.Categorical.Color15.Default,
      showTooltip: true,
      min: 0,
      max: 1000,
      thresholds: [
        {
          value: 10000,
          color: Colors.Charts.Threshold.Good.Default,
          name: 'Good',
        },
        {
          value: 100000,
          color: Colors.Charts.Threshold.Warning.Default,
          name: 'Warning',
        },
        {
          value: 1000000,
          color: Colors.Charts.Threshold.Bad.Default,
          name: 'Bad',
        },
      ],
    },
  },
  {
    header: 'Throughput',
    accessor: 'throughput',
    autoWidth: true,
    columnType: 'meterbar',
    config: {
      color: Colors.Charts.Categorical.Color15.Default,
      showTooltip: true,
      min: 0,
      max: 10,
      thresholds: [
        {
          value: 0,
          color: Colors.Charts.Threshold.Good.Default,
          name: 'Good',
        },
        {
          value: 5,
          color: Colors.Charts.Threshold.Warning.Default,
          name: 'Warning',
        },
        {
          value: 10,
          color: Colors.Charts.Threshold.Bad.Default,
          name: 'Bad',
        },
      ],
    },
  }
];