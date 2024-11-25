import { Container, Flex } from '@dynatrace/strato-components'
import { DataTable, TimeframeV2, Timeseries } from '@dynatrace/strato-components-preview'
import React, { useState } from 'react'
import { subHours, subDays } from "date-fns"
import { tagsQueryResult } from '../Data/QueryResult'

const LandingPage = () => {
  const [time, setTime] = useState<TimeframeV2 | null>({
    from: {
      absoluteDate: subDays(new Date(), 7).toISOString(),
      value: 'now()-7d',
      type: 'expression',
    },
    to: {
      absoluteDate: new Date().toISOString(),
      value: 'now()',
      type: 'expression',
    },
  });

  const tags = tagsQueryResult({from: time?.from.absoluteDate, to: time?.to.absoluteDate})

  return (
    <Flex width="100%" justifyContent='center' gap={16}>
      <Container>
        <DataTable data={[] as Timeseries[]} columns={[]}>

        </DataTable>
      </Container>
    </Flex>
  )
}