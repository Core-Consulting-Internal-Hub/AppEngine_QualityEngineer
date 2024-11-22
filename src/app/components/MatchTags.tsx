export const MatchTags = (props) => {
  const sets = new Map<any, { name: any, id: any }>();
    props.queryResult.data?.records.forEach(record => {
      if (record?.tags && Array.isArray(record?.tags)) {
        for (const tag of record.tags) {
          if (tag && typeof tag === 'string' && props.row.some(transaction => {
            const tagValue = tag.split(":");
            return tagValue[0] === "Transaction" &&  tagValue[tagValue.length - 1] === transaction;
          })) {
            // Use id as the unique key in Map
            sets.set(record.id, { name: record.name, id: record.id });
          }
        }
      }
    });
  return sets;
}

export const MatchTagsWithTags = (props) => {
  const sets = new Map<any, { name: any, id: any, tags: any }>();
    props.queryResult.data?.records.forEach(record => {
      if (record?.tags && Array.isArray(record?.tags)) {
        for (const tag of record.tags) {
          if (tag && typeof tag === 'string' && props.row.some(transaction => {
            const tagValue = tag.split(":");
            return tagValue[0] === "Transaction" && tagValue[tagValue.length - 1] === transaction;
          })) {
            // Use id as the unique key in Map
            sets.set(record.id, { name: record.name, id: record.id, tags: record.tags });
          }
        }
      }
    });
  return sets;
}
