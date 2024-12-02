import { Container, Flex, ProgressCircle } from '@dynatrace/strato-components'
import { ChartInteractions, ChartToolbar, convertToTimeseries, DataTable, FilterBar, SelectV2, TableColumn, TimeframeSelector, TimeframeV2, Timeseries, TimeseriesChart } from '@dynatrace/strato-components-preview'
import React, { useEffect, useState } from 'react'
import { subDays } from "date-fns"
import { useDqlQuery } from '@dynatrace-sdk/react-hooks'

export const LandingPage = () => {
  const [time, setTime] = useState<TimeframeV2 | null>({
    from: {
      absoluteDate: subDays(new Date(), 14).toISOString(),
      value: 'now()-14d',
      type: 'expression',
    },
    to: {
      absoluteDate: new Date().toISOString(),
      value: 'now()',
      type: 'expression',
    },
  });

  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [transactionFilter, setTransactionFilter] = useState<string[]>([]);

  const chart = useDqlQuery({
    body: {
      query: `timeseries meantime = avg(jmeter.usermetrics.transaction.meantime), from: "${time?.from.absoluteDate}", to: "${time?.to.absoluteDate}", by: { run, cycle, transaction }
        | filter isNotNull(cycle) and isNotNull(run)`
    }
  });

  const table = useDqlQuery({
    body: {
      query: `timeseries meantime = avg(jmeter.usermetrics.transaction.meantime), from: "${time?.from.absoluteDate}", to: "${time?.to.absoluteDate}", by: { run, cycle, transaction, scenario }
        | summarize by:{transaction}, {cycle = collectArray(cycle), run = collectArray(run), scenario = collectArray(scenario)}
        | filter isNotNull(cycle) and isNotNull(run)`
    }
  });

  console.log(table)

  const chartData = chart.data?.records || [];

  // Deduplicate transactions
  const tagsOnly = React.useMemo(() => {
    return Array.from(new Set(chartData.flatMap((row) => row?.transaction || [])));
  }, [chartData]);

  // Update filtered data whenever chartData or filters change
  useEffect(() => {
    const filtered = chartData.filter((row) => {
      const matchesTransaction =
        !transactionFilter || transactionFilter.length === 0
          ? true
          : transactionFilter.some((filterValue) => row?.transaction === filterValue);

      return matchesTransaction;
    });

    setFilteredData(filtered);
  }, [transactionFilter, chartData]);

  const columns: TableColumn[] = [
    {
      header: 'Transaction',
      accessor: 'transaction',
      ratioWidth: 1
    },
    {
      header: 'Cycle',
      accessor: 'cycle',
      ratioWidth: 1,
      cell: row => row.value.join('\n'),
    },
    {
      header: 'Run',
      accessor: 'run',
      ratioWidth: 1,
      cell: row => row.value.join('\n'),
    },
    {
      header: 'Scenario',
      accessor: 'scenario',
      ratioWidth: 1,
      cell: row => row.value.join('\n')
    }
  ]

  return (
    <Flex width="100%" flexDirection='column' justifyContent="center" gap={16}>
      <Container width={"100%"}>
        <Flex width={"100%"} justifyContent='space-between' alignItems='center'>
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
        <Flex width={"100%"} marginTop={16} justifyContent='center' alignContent='center'>
          {chart.isLoading && <ProgressCircle />}
          {chart.data && (
            <TimeseriesChart
              data={convertToTimeseries(filteredData, chart.data?.types)}
              gapPolicy={"connect"}
              height={400}
            >
              <ChartToolbar/>
              <ChartInteractions>
                <ChartInteractions.Zoom />
                <ChartInteractions.ZoomX />
                <ChartInteractions.Pan />
              </ChartInteractions>
              <TimeseriesChart.Legend position='bottom' ratio={20}/>
              <TimeseriesChart.YAxis label="Response Time" formatter={(value) => `${(value/1000).toFixed(2)}s` }/>
              <TimeseriesChart.XAxis
                label="Time"
                min={time?.from.absoluteDate}
                max={time?.to.absoluteDate}
              />
            </TimeseriesChart>
          )}
        </Flex>
      </Container>
      <Container width={"100%"}>
        {table.data && <DataTable data={table.data?.records} columns={columns}>

        </DataTable>}
      </Container>
    </Flex>
  );
};
