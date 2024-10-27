import React, { Profiler } from 'react';
import { Flex } from '@dynatrace/strato-components/layouts';
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
import { queryForQ1 } from '../queries/query1';
import { Heading } from '@dynatrace/strato-components';
import { ProgressCircle } from '@dynatrace/strato-components';

export const Task1 = () => {
  const result = useDqlQuery({
    body: {
      query: queryForQ1,
    },
  });

  const columns: TableColumn[] = [
    {
      header: 'ID',
      accessor: 'id',
      autoWidth: true,
    },
    {
      header: 'Name',
      accessor: `name`,
      autoWidth: true,
    },
    {
      header: 'AWS Instance Type',
      accessor: 'awsInstanceType',
      autoWidth: true,
    },
  ];

  return (
    <Flex width="100%" flexDirection="column" justifyContent="center" gap={16}>
      
      <Heading as="h3" >QE App Engine</Heading> 
        {result.isLoading && <ProgressCircle />} 
        {result.data && (
        <DataTable 
          data={convertToTimeseries(result.data.records, result.data.types)} columns={columns}
        >
        <DataTable.Pagination />
        </DataTable>
        
      )}
      
    </Flex>
  );
};