import React, { useEffect, useMemo, useState } from 'react';
import { Container, Flex, Heading, Link, ProgressCircle, Text } from '@dynatrace/strato-components';
import {
  ChartInteractions,
  ChartToolbar,
  convertToTimeseries,
  DataTable,
  DonutChart,
  DonutChartData,
  FilterBar,
  InnerParams,
  SelectV2,
  SingleValue,
  TableColumn,
  TimeframeSelector,
  TimeframeV2,
  TimeseriesChart,
} from '@dynatrace/strato-components-preview';
import { Link as RouterLink } from 'react-router-dom';
import { subDays, subHours, subMinutes } from 'date-fns';
import { useDqlQuery } from '@dynatrace-sdk/react-hooks';
import { queryExecutionClient } from '@dynatrace-sdk/client-query';
import { MatchTagsResult } from '../components/MatchTags';
import { useDocContext } from '../components/DocProvider';
import { Colors } from '@dynatrace/strato-design-tokens';

export const LandingPage = () => {
  const [time, setTime] = useState<TimeframeV2 | null>({
    from: {
      absoluteDate: subHours(new Date(), 24).toISOString(),
      value: 'now()-24h',
      type: 'expression',
    },
    to: {
      absoluteDate: new Date().toISOString(),
      value: 'now()',
      type: 'expression',
    },
  });

  const { docContent } = useDocContext();
  const [ filteredChartData, setFilteredChartData ] = useState<any[]>([]);
  const [ filteredTableData, setFilteredTableData ] = useState<any[]>([]);
  const [ transactionFilter, setTransactionFilter ] = useState<string[]>([]);

  const chart = useDqlQuery({
    body: {
      query: `timeseries meantime = avg(jmeter.usermetrics.transaction.meantime), from: "${time?.from.absoluteDate}", to: "${time?.to.absoluteDate}", by: { transaction }`,
    },
  });

  const specificTimeUsage = useDqlQuery({
    body: {
      query: `timeseries meantime = avg(jmeter.usermetrics.transaction.meantime), from: "${time?.from.absoluteDate}", to: "${time?.to.absoluteDate}", by: { run, cycle }
        | filter isNotNull(cycle) and isNotNull(run)`,
    },
  });

  const table = useDqlQuery({
    body: {
      query: `timeseries meantime = avg(jmeter.usermetrics.transaction.meantime), from: "${time?.from.absoluteDate}", to: "${time?.to.absoluteDate}", by: { run, cycle, transaction, scenario }
        | filter isNotNull(cycle) and isNotNull(run) and isNotNull(scenario)
        | summarize by:{run, cycle, scenario }, transactions = collectArray(transaction)
        | fieldsAdd crs = splitString(concat(cycle, " " , run, " " , scenario), " ")
        | summarize by:{transactions}, crs = collectArray(crs)`,
    },
  });

  const donut = useDqlQuery({
    body: {
      query: `timeseries meantime = avg(jmeter.usermetrics.transaction.meantime), from: "${time?.from.absoluteDate}", to: "${time?.to.absoluteDate}", by: { run, cycle, transaction, scenario }
        | filter isNotNull(cycle) and isNotNull(run) and isNotNull(scenario)
        | summarize by:{ cycle }, {runs = collectDistinct(run), scenarios = collectDistinct(scenario), transactions = collectDistinct(transaction)}
        | fieldsAdd runsCount = arraySize(runs), scenariosCounts = arraySize(scenarios), transactionsCount = arraySize(transactions)`
    },
  });

  const singleValue = useDqlQuery({
    body: {
      query: `timeseries meantime = avg(jmeter.usermetrics.transaction.meantime), from: "${time?.from.absoluteDate}", to: "${time?.to.absoluteDate}", by: { run, cycle, transaction, scenario }
        | filter isNotNull(cycle) and isNotNull(run) and isNotNull(scenario)
        | summarize scenarios = collectDistinct(scenario)`
    },
  });

  const donutData: DonutChartData = {
    slices: donut.data?.records.map(item => ({
      category: item?.cycle?.toString() || '',
      value: Number(item?.runsCount) || 0,
    })) || [],
    unit: 'run(s)'
  };

  const singleValueData = singleValue.data?.records
  .flatMap(item => item?.scenarios)
  .sort((a, b) => {
    // Ensure a and b are defined before comparison
    if (a && b && typeof a === 'string' && typeof b === 'string') {
      const numA = parseInt(a, 10); // Parse numbers directly
      const numB = parseInt(b, 10);
      return numA - numB; // Sort numerically
    }
    // Handle undefined values by pushing them to the end
    return a ? -1 : 1;
  });

  const smallestVU: any = singleValueData?.shift() || "N/A";
  const largestVU: any = singleValueData?.pop() || "N/A";

  const chartData = chart.data?.records || [];
  const [tableData, setTableData] = useState<any>([]);

  const updateCRS = (transaction, crs, result) => {
    setTableData((prevState) => {
      const updatedTableData = prevState.map((item) => {
        if (item.transactions === transaction) {
          const updatedCrs = item.crs.map((crsItem) => {
            // Check if the CRS item matches and return the updated CRS
            if (crsItem[0] === crs[0] && crsItem[1] === crs[1]) {
              return [...crsItem, result]; // Add result to the CRS item
            }
            return crsItem; // Return the unmodified crsItem if no match
          });
          
          return { ...item, crs: updatedCrs }; // Return updated item
        }
        return item; // Return the unmodified item if no match
      });
  
      return updatedTableData; // Return the updated table data
    });
  };
  
  const renderPassFailCell = async ({transaction, crs}) => {
    const defaultCriteria = {
      "Failure Rate": 10.0,
      "Response Time": 120.0,
      "CPU Usage": 90.0,
      "Memory Usage": 90.0,
    };

    const specificCycleRun = specificTimeUsage.data?.records.filter((item) => item && item.cycle === crs[0] && item.run === crs[1]) || [];
    const datapoint = specificCycleRun && specificTimeUsage?.data && convertToTimeseries(specificCycleRun, specificTimeUsage.data.types) || [];

    const start = datapoint && datapoint?.[0]?.datapoints?.[0]?.start?.toISOString();
    const end = datapoint && datapoint?.[0]?.datapoints?.[datapoint?.[0]?.datapoints?.length - 1]?.end?.toISOString();

    const [
      errorToken,
      throughputToken,
      meantimeToken,
      cpuToken,
      memoryToken,
      hostTagsToken,
    ] = await Promise.all([
      queryExecutionClient.queryExecute({
        body: {
          query: `timeseries error = avg(jmeter.usermetrics.transaction.error), from: "${start}", to: "${end}", by: { run, cycle, transaction }
                  | filter run == "${crs[1]}" and cycle == "${crs[0]}"
                  | sort arrayAvg(error) desc`,
        },
      }),
      queryExecutionClient.queryExecute({
        body: {
          query: `timeseries count = avg(jmeter.usermetrics.transaction.count), from: "${start}", to: "${end}", by: { cycle, run, transaction }
                  | filter run == "${crs[1]}" and cycle == "${crs[0]}"
                  | sort arrayAvg(count) desc`,
        },
      }),
      queryExecutionClient.queryExecute({
        body: {
          query: `timeseries meantime = avg(jmeter.usermetrics.transaction.meantime), from: "${start}", to: "${end}", by: { run, cycle, transaction }
                  | filter run == "${crs[1]}" and cycle == "${crs[0]}"
                  | sort arrayAvg(meantime) desc`,
        },
      }),
      queryExecutionClient.queryExecute({
        body: {
          query: `timeseries usage = avg(dt.host.cpu.usage), from: "${start}", to: "${end}", by: { dt.entity.host }
                  | fieldsAdd entityName(dt.entity.host)
                  | fieldsRename id = dt.entity.host`,
        },
      }),
      queryExecutionClient.queryExecute({
        body: {
          query: `timeseries usage = avg(dt.host.memory.usage), from: "${start}", to: "${end}", by: { dt.entity.host }
                  | fieldsAdd entityName(dt.entity.host)
                  | fieldsRename id = dt.entity.host`,
        },
      }),
      queryExecutionClient.queryExecute({
        body: {
          query: `fetch dt.entity.host, from: "${start}", to: "${end}"
                  | fieldsAdd tags
                  | filter isNotNull(tags)
                  | fieldsRename name = entity.name`,
        },
      }),
    ]);

    const performanceValue = async () => {
      if (
        !errorToken?.requestToken ||
        !throughputToken?.requestToken ||
        !meantimeToken?.requestToken ||
        !cpuToken?.requestToken ||
        !memoryToken?.requestToken ||
        !hostTagsToken?.requestToken
      ) {
        return {specificErrorPercentage: [], specificMeantimeData: [], matchedSpecificCpu: [], matchedSpecificMemory: []}
      }
    
      // Poll all results in parallel
      const [
        specificError,
        specificThroughput,
        specificMeantime,
        specificCpu,
        specificMemory,
        specificHostTags,
      ] = await Promise.all([
        queryExecutionClient.queryPoll({ requestToken: errorToken.requestToken }),
        queryExecutionClient.queryPoll({ requestToken: throughputToken.requestToken }),
        queryExecutionClient.queryPoll({ requestToken: meantimeToken.requestToken }),
        queryExecutionClient.queryPoll({ requestToken: cpuToken.requestToken }),
        queryExecutionClient.queryPoll({ requestToken: memoryToken.requestToken }),
        queryExecutionClient.queryPoll({ requestToken: hostTagsToken.requestToken }),
      ]);

      const specificThroughputData = specificThroughput.result?.records?.filter(item => item?.cycle === crs[0] && item?.run === crs[1])?.map(item => item)?.map(item => {
        if (item && item.count && Array.isArray(item.count)) {
          // Convert interval to minutes
          const interval = Number(item.interval) / 1e9 / 60;
    
          // Update count by dividing each element by interval
          const updatedCount = item.count?.map(data => typeof data === "number" ? (data / interval) : null);
    
          // Return the updated item with the modified count
          return { ...item, count: updatedCount };
        }
        return item; // Return the item as is if the conditions aren't met
      }) || [];

      const specificErrorPercentage = specificError.result?.records.filter(item => item?.cycle === crs[0] && item?.run === crs[1])?.map(item => item)?.map(failureItem => {
        const specificThroughputItem = specificThroughputData.find(item => item && failureItem && item.cycle === failureItem.cycle && item.run === failureItem.run && item.transaction === failureItem.transaction);
        if (Array.isArray(failureItem?.error)) {
          // Convert interval to minutes
          const interval = Number(failureItem?.interval) / 1e9 / 60;
    
          // Update count by dividing each element by interval
          const updatedCount = failureItem?.error?.map((data, i) => {
            const requestValue = specificThroughputItem?.count && specificThroughputItem.count[i];
            if (data && requestValue  && requestValue !== 0) {
              return Number((((Number(data) / interval) / requestValue) * 100).toFixed(2));
            } else if (requestValue === 0) 
              return 0
            return null
          });
    
          // Return the updated item with the modified count
          return { ...failureItem, error: updatedCount };
        }
        return failureItem; // Return the item as is if the conditions aren't met
      }) || [];

      const matchedSpecificCpu: any[] = [];
      const matchedSpecificMemory: any[] = [];

      const host = MatchTagsResult({queryResult: specificHostTags, row: transaction})

      host.forEach(item => {
        const matchingCpuHosts = specificCpu.result?.records?.filter(record => record?.id === item.id) || [];
        matchedSpecificCpu.push(...matchingCpuHosts);
    
        const matchingMemoryHosts = specificMemory.result?.records?.filter(record => record?.id === item.id) || [];
        matchedSpecificMemory.push(...matchingMemoryHosts);
      });
      
      const specificMeantimeData = specificMeantime.result?.records?.map(item => ({
        ...item,
        meantime: Array.isArray(item?.meantime)
          ? item?.meantime?.map(value => (value ? Number(value) / 1000 : null))
          : []
      }));
      
      

      return {specificErrorPercentage, specificMeantimeData, matchedSpecificCpu, matchedSpecificMemory}
  }

  const { specificErrorPercentage, specificMeantimeData, matchedSpecificCpu, matchedSpecificMemory } = await performanceValue();
  
    // Utility: Calculate metric average from data and field
    const calculateMetricAverage = (data, field) => data
      ?.flatMap(item => item?.[field] || []) // Access the field dynamically
      .filter(value => typeof value === "number") // Filter only numbers
      .reduce((sum, value, _, arr) => sum + value / arr.length, 0) // Calculate average
      .toFixed(2);
  
    // Generate average data for the row
    const getAvgData = () => ({
      "Failure Rate": calculateMetricAverage(specificErrorPercentage, "error"),
      "Response Time": calculateMetricAverage(specificMeantimeData, "meantime"),
      "CPU Usage": calculateMetricAverage(matchedSpecificCpu, "usage"),
      "Memory Usage": calculateMetricAverage(matchedSpecificMemory, "usage"),
    });
  
    // Check criteria and return Pass/Fail with criteria type
    const checkCriteria = (avgData, docContent, cycle, run) => {
      const matchingCriteria = docContent.find(
        (criteria) => criteria.cycle === cycle && criteria.run === run
      );
      const criteria = matchingCriteria?.criteria || defaultCriteria;
      const criteriaType = matchingCriteria ? "customized" : "default";
      
      const passes = Object.entries(avgData).every(
        ([key, value]) => Number(value) <= (criteria[key])
      );
  
      return {
        result: passes ? "Passed" : "Failed",
        criteriaType,
      };
    };
  
    // Main logic
    const avgData = getAvgData();
    const { result, criteriaType } = checkCriteria(avgData, docContent, crs[0], crs[1]);
  
    // Update row data if needed
    updateCRS(transaction, crs, result);
}

  // Extract unique transactions from chart data
  const tagsOnly = useMemo(() => {
    return Array.from(new Set(chartData.flatMap((row) => row?.transaction || [])));
  }, [chartData]);

  // Update filtered chart data whenever the filter or data changes
  useEffect(() => {
    if (!table.isLoading && !specificTimeUsage.isLoading) {
      setTableData(table.data?.records);
      table?.data?.records.map(row => {
        Array.isArray(row?.crs) ? row?.crs?.map(crs => {
          renderPassFailCell({transaction: row.transactions, crs: crs})
        }) : 0
      });
    }
  }, [table.isLoading, specificTimeUsage.isLoading])

  useEffect(() => {
    const filteredChartData = chartData.filter((row) => {
      const matchesTransaction =
        !transactionFilter || transactionFilter.length === 0
          ? true
          : transactionFilter.some((filterValue) => row?.transaction === filterValue);

      return matchesTransaction;
    });

    const filteredTableData = tableData.filter((row) => {
      const matchesTransaction =
        !transactionFilter || transactionFilter.length === 0
          ? true
          : transactionFilter.some((filterValue) => row?.transactions.some(transaction => transaction === filterValue));

      return matchesTransaction;
    });

    setFilteredChartData(filteredChartData);
    setFilteredTableData(filteredTableData);
  }, [transactionFilter, chartData, tableData]);

  const columns: TableColumn[] = [
    {
      header: 'Transaction(s)',
      accessor: 'transactions',
      autoWidth: true,
      ratioWidth: 2,
      cell: (row) => 
        <DataTable.Cell>
          <Flex width={'100%'} flexDirection='column'>
            {row.value?.map(item => 
              <Text>
                {item}
              </Text>
            )}
          </Flex>
        </DataTable.Cell>
    },
    {
      id: 'crs',
      header: 'Cycle|Run|Scenario',
      accessor: row => row.crs,
      autoWidth: true,
      ratioWidth: 1,
      cell: (row) => {
        const specificCycleRun = specificTimeUsage?.data?.records?.filter((item) => row.value.map(crs => item?.cycle === crs?.[0] && item?.run === crs?.[1])) || [];
        const datapoints = specificCycleRun && specificTimeUsage?.data && convertToTimeseries(specificCycleRun, specificTimeUsage.data.types) || [];

        const start = datapoints?.[0]?.datapoints?.[0]?.start?.toISOString();
        const end = datapoints?.[0]?.datapoints?.[datapoints?.[0]?.datapoints.length - 1]?.end?.toISOString();
        return (
          <DataTable.Cell>
            <Flex width={'100%'} flexDirection='column'>
              {row.value.map(item => 
                <Link as={RouterLink} to="/details" state={{cycle: item?.[0], run: item?.[1], from: start, to: end}}>
                  <Text style={{color: item[item?.length-1] === 'Failed' ? Colors.Text.Critical.Default : Colors.Text.Success.Default}}>{item.slice(0, 3).join(' | ')}</Text>
                </Link>
              )}
            </Flex>
          </DataTable.Cell>
        )
      }
    },
    {
      id: 'number of pass',
      header: 'Number Passed / Total',
      accessor: row => {
        const passedLength = row.crs.map(item => item?.[item?.length - 1]).filter(item => item === "Passed" && item).length;
        const totalLength = row.crs.length;

        return ([passedLength, totalLength])
      },
      autoWidth: true,
      ratioWidth: 1,
      cell: row => {
        return (
          <DataTable.Cell>
            {!row.value ? <ProgressCircle /> : (
              <Flex flexDirection='column'>
                <Text textStyle='small'>{row.value?.[0]}/{row.value?.[1]}</Text>
              </Flex>
            )}
          </DataTable.Cell>
        )
      },
    },
    {
      id: 'status',
      header: 'Passing Rate',
      accessor: row => {
        const passedLength = row.crs.map(item => item?.[item?.length - 1]).filter(item => item === "Passed" && item).length;
        const totalLength = row.crs.length;
        console.log(Math.floor(0 * 10000))
        return (Math.floor(passedLength * 10000 ) / 100 / totalLength);
      },
      autoWidth: true,
      ratioWidth: 1,
      cell: row => {
        console.log(row)
        return (
          <DataTable.Cell>
            {row.value >= 0 ? (
              <Flex flexDirection='column'>
                <Text textStyle='base-emphasized'>{row.value}%</Text>
              </Flex>
            ) : <ProgressCircle />}
          </DataTable.Cell>
        )
      },
      thresholds: [
        {
          value: 50,
          comparator: 'less-than-or-equal-to',
          backgroundColor: Colors.Background.Container.Critical.Accent,
        },
        {
          value: 50,
          comparator: 'greater-than',
          backgroundColor: Colors.Background.Container.Warning.Accent,
        },
        {
          value: 90,
          comparator: 'greater-than',
          backgroundColor: Colors.Background.Container.Success.Accent
        }
      ],
      alignment: 'center'
    },
  ];

  return (
    <Flex width={'100%'} flexDirection="column" justifyContent="center" gap={16}>
      <Container>
        <Flex justifyContent="space-between" alignItems="center">
          <FilterBar onFilterChange={() => {}}>
            <FilterBar.Item name="transaction" label="Filter by Transaction">
              <SelectV2
                value={transactionFilter}
                onChange={setTransactionFilter}
                clearable
                multiple
              >
                <SelectV2.Content>
                  {tagsOnly.map((transaction) => (
                    <SelectV2.Option key={String(transaction)} value={transaction}>
                      {transaction?.toLocaleString()}
                    </SelectV2.Option>
                  ))}
                </SelectV2.Content>
              </SelectV2>
            </FilterBar.Item>
          </FilterBar>
          <TimeframeSelector value={time} onChange={setTime} />
        </Flex>
        <Flex
          width={'100%'}
          marginTop={16}
          justifyContent="center"
          alignContent="center"
        >
          <Flex flexDirection='column' width={'100%'} justifyContent="center" alignContent="center">
            <Heading level={2}>Average Response Time</Heading>
            {chart.isLoading && <ProgressCircle />}
            {chart.data && (
              <TimeseriesChart
                data={convertToTimeseries(filteredChartData, chart.data?.types)}
                height={400}
              >
                <ChartToolbar />
                <ChartInteractions>
                  <ChartInteractions.Zoom />
                  <ChartInteractions.ZoomX />
                  <ChartInteractions.Pan />
                </ChartInteractions>
                <TimeseriesChart.Legend position="bottom" ratio={20} />
                <TimeseriesChart.YAxis
                  label="Response Time"
                  formatter={(value) => `${(value / 1000).toFixed(2)}s`}
                />
                <TimeseriesChart.XAxis
                  label="Time"
                  min={time?.from.absoluteDate}
                  max={time?.to.absoluteDate}
                />
              </TimeseriesChart>
            )}
          </Flex>
          <Flex flexDirection='column' width={'100%'} justifyContent='center' alignContent='center'>
            <Heading level={2}>Run(s) per cycle</Heading>
            {donut.isLoading && <ProgressCircle />}
            {donut.data && (
              <DonutChart data={donutData} height={400}>
                <DonutChart.Inner>
                  
                  {({ absoluteValue }: InnerParams) => (
                    <Flex flexDirection='column'> 
                      <Text>Total: {absoluteValue}runs</Text>
                      <Text>Smallet VU: {smallestVU}</Text>
                      <Text>Largest VU: {largestVU}</Text>
                    </Flex>
                  )}
                  
                </DonutChart.Inner>
                <DonutChart.Legend position='bottom' />
              </DonutChart>
            )}
            
          </Flex>
        </Flex>
      </Container>
      <Container>
        {table.isLoading && <ProgressCircle />}
        {table.data && (
          <DataTable 
            data={filteredTableData} 
            columns={columns}
            sortable
            variant={{
              rowDensity: 'default',
              rowSeparation: 'zebraStripes',
              verticalDividers: true,
              contained: true,
            }}
          >
          </DataTable>
        )}
      </Container>
    </Flex>
  );
};
