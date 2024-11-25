import { useDqlQuery } from "@dynatrace-sdk/react-hooks";

export const tagsQueryResult = ({from, to}) => {
  return useDqlQuery({
    body: {
      query: `timeseries meantime = avg(jmeter.usermetrics.transaction.meantime), from: "${from}", to: "${to}", by: { run, transaction, cycle, scenario }
        | summarize by:{timeframe, run, cycle, scenario} , transaction = collectArray(transaction)
        | filter isNotNull(cycle) and isNotNull(run) and isNotNull(scenario)`
    }
});};

export const hostTagsQueryResult = ({from, to}) => { 
  return useDqlQuery({
  body: {
    query: `fetch dt.entity.host, from: -30d, to: "${to}"
            | fieldsAdd tags
            | filter isNotNull(tags)
            | fieldsRename name = entity.name`
  }
});};

export const processTagsQueryResult = ({from, to}) => { 
  return useDqlQuery({
  body: {
    query: `fetch dt.entity.process_group, from: -30d, to: "${to}"
            | fieldsAdd tags
            | filter isNotNull(tags)
            | fieldsRename name = entity.name`
  }
});};

export const serviceTagsQueryResult = ({from, to}) => { 
  return useDqlQuery({
  body: {
    query: `fetch dt.entity.service, from: -30d, to: "${to}"
            | fieldsAdd tags
            | filter isNotNull(tags)
            | fieldsRename name = entity.name`
  }
});};

export const errorQueryResult = ({from, to, run, cycle}) => {
  return useDqlQuery({
    body: {
      query: `timeseries error = avg(jmeter.usermetrics.transaction.error), from: "${from}", to: "${to}", by: { run, cycle, transaction }
      | filter run == "${run}" and cycle == "${cycle}"
      | sort arrayAvg(error) desc`
  }
});};

export const meantimeQueryResult = ({from, to, run, cycle}) => {
  return useDqlQuery({
  body: {
    query: `timeseries meantime = avg(jmeter.usermetrics.transaction.meantime), from: "${from}", to: "${to}", by: { run, cycle, transaction }
      | filter run == "${run}" and cycle == "${cycle}"
      | sort arrayAvg(meantime) desc`
  }
});};

export const errorQueryResultScenario = ({from, to}) => {
  return useDqlQuery({
    body: {
      query: `timeseries error = avg(jmeter.usermetrics.transaction.error), from: "${from}", to: "${to}", by: { run, cycle }
      | sort arrayAvg(error) desc`
  }
});};

export const meantimeQueryResultScenario = ({from, to}) => {
  return useDqlQuery({
  body: {
    query: `timeseries meantime = avg(jmeter.usermetrics.transaction.meantime), from: "${from}", to: "${to}", by: { run, cycle }
      | sort arrayAvg(meantime) desc`
  }
});};

export const cpuUsageQueryResult = ({from, to}) => {
  return useDqlQuery({
  body: {
    query: `timeseries usage = avg(dt.host.cpu.usage), from: -30d, to: "${to}", by: { dt.entity.host }
      | fieldsAdd entityName(dt.entity.host)
      | fieldsRename id = dt.entity.host`
  }
});};

export const memoryUsageQueryResult = ({from, to}) => {
  return useDqlQuery({
  body: {
    query: `timeseries usage = avg(dt.host.memory.usage), from: -30d, to: "${to}", by: { dt.entity.host }
      | fieldsAdd entityName(dt.entity.host)
      | fieldsRename id = dt.entity.host`
  }
});};