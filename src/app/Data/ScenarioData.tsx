import { FieldTypeType, QueryResult } from "@dynatrace-sdk/client-query"
import { subHours, addMinutes } from 'date-fns';

export const generateResponseTimeData = (time) => {
  const intervalDurationMs = 300000; // 5 minutes in milliseconds
  const startTime = new Date(time.from.absoluteDate).getTime();
  const endTime = new Date(time.to.absoluteDate).getTime();

  // Calculate the number of intervals based on the timeframe
  const numIntervals = Math.floor((endTime - startTime) / intervalDurationMs);

  // Generate or retrieve data points for each interval
  const data = Array.from({ length: numIntervals }, (_, index) => {
    const timestamp = startTime + index * intervalDurationMs;
    // const isoTimestamp = new Date(timestamp).toISOString();

    // Generate random data or null for intervals that should have no data
    return index % 5 === 0 ? null : Math.floor(Math.random() * 10000000) + 5000000;
  });

  return data; // Return the generated data
};

export const getResponseTimeData = (time, data) => {
  return {
    records: [
      {
        timeframe: { start: time.from.absoluteDate, end: time.to.absoluteDate },
        interval: "300000000000", // 5 minutes in nanoseconds
        "median(duration)": data
      },
    ],
    metadata: {},
    types: [
      {
        mappings: {
          timeframe: {
            type: FieldTypeType.Timeframe,
          },
          interval: {
            type: FieldTypeType.Duration,
          },
          "median(duration)": {
            type: FieldTypeType.Array,
            types: [
              {
                mappings: {
                  element: {
                    type: FieldTypeType.Double,
                  },
                },
                indexRange: [0, data.length - 1],
              },
            ],
          },
        },
        indexRange: [0, 0],
      },
    ],
  };
};

export const getCpuUsageData = (time, data) => {
  return {
    "records": [
      {
        "timeframe": { start: time.from.absoluteDate, end: time.to.absoluteDate },
        "interval": "300000000000",
        "avg(span.timing.cpu)": data
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
        "indexRange": [0, data.length - 1],
      }
    ]
  }
}


export const generateFailureRateData = (time) => {
  const intervalDurationMs = 300000; // 15 seconds in milliseconds
  const startTime = new Date(time.from.absoluteDate).getTime();
  const endTime = new Date(time.to.absoluteDate).getTime();

  // Calculate the number of intervals based on the timeframe
  const numIntervals = Math.floor((endTime - startTime) / intervalDurationMs);

  // Generate data for each interval
  const data = Array.from({ length: numIntervals }, (_, index) => {
    const timestamp = startTime + index * intervalDurationMs;
    const isoTimestamp = new Date(timestamp).toISOString();

    // Randomly set failure rate values, or keep them as 0
    const failureRate = Math.random() < 0.8 ? 0 : Math.floor(Math.random() * 5) + 1; // Mostly 0, with occasional values 1-5

    return {
      "timestamp": isoTimestamp,
      "failureRate": failureRate,
    };
  });

  return data;
};

export const getFailureRateData = (time, data) => {
  return {
    records: data,
    metadata: {},
    types: [
      {
        mappings: {
          "timestamp": {
            type: FieldTypeType.Timestamp,
          },
          "failureRate": {
            type: FieldTypeType.Long,
          },
        },
        indexRange: [0, data.length - 1],
      },
    ],
  };
};


export const generateThroughputData = (time) => {
  const intervalDurationMs = 300000; // 15 seconds in milliseconds
  const startTime = new Date(time.from.absoluteDate).getTime();
  const endTime = new Date(time.to.absoluteDate).getTime();

  // Calculate the number of intervals based on the timeframe
  const numIntervals = Math.floor((endTime - startTime) / intervalDurationMs);

  // Generate data for each interval
  const data = Array.from({ length: numIntervals }, (_, index) => {
    const timestamp = startTime + index * intervalDurationMs;
    const isoTimestamp = new Date(timestamp).toISOString();

    // Generate random throughput values, adjust the logic if needed
    const throughput = Math.random() * (1 - 0.2) + 0.2; // Random throughput between 0.2 and 1

    return {
      "timestamp": isoTimestamp,
      "throughput": throughput,
    };
  });
  return data;
}

export const getThroughputData = (time, data) => {
    return {
    records: data,
    metadata: {},
    types: [
      {
        mappings: {
          "timestamp": {
            type: FieldTypeType.Timestamp,
          },
          "throughput": {
            type: FieldTypeType.Double,
          },
        },
        indexRange: [0, data.length - 1],
      },
    ],
  };
};

// fetch spans
// | filter isNotNull(`request_attribute.Easytrade login`)
// | fieldsRename easyTradeLogin = `request_attribute.Easytrade login`
// | summarize 
//       by: {easyTradeLogin, bin(start_time, 5m)},
//       {responseTime = sum(duration),
//       failureRate = (countif(http.response.status_code != 200) / count()) * 100,
//       cpuUsage = avg(span.timing.cpu),
//       throughput = count() / 120.0} 
// | fieldsRename timestamp = `bin(start_time, 5m)`
export const tableQueryResult: QueryResult = 
{
  "records": [
    {
      "Run": "run01",
      "timestamp": "2024-11-07T11:30:00.000000000+08:00",
      "duration": "7262000",
      "numberOfUsers": "0",
      "failureRate": "0",
      "throughput": 0.2
    },
    {
      "Run": "run02",
      "timestamp": "2024-11-07T10:30:00.000000000+08:00",
      "duration": "6192000",
      "numberOfUsers": "0",
      "failureRate": "0",
      "throughput": 0.2
    },
    {
      "Run": "run03",
      "timestamp": "2024-11-07T09:30:00.000000000+08:00",
      "duration": "8923000",
      "numberOfUsers": "0",
      "failureRate": "0",
      "throughput": 0.2
    },
    {
      "Run": "run04",
      "timestamp": "2024-11-07T12:30:00.000000000+08:00",
      "duration": "6356000",
      "numberOfUsers": "0",
      "failureRate": "0",
      "throughput": 0.2
    },
    {
      "Run": "run05",
      "timestamp": "2024-11-07T11:30:00.000000000+08:00",
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
        "timestamp": {
          "type": FieldTypeType.Timestamp
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