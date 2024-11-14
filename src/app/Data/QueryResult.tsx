import { useDqlQuery } from "@dynatrace-sdk/react-hooks";

export const hostTagsQueryResult = (from, to) => { 
  return useDqlQuery({
  body: {
    query: `fetch dt.entity.host, from: "${from}", to: "${to}"
            | fieldsAdd tags
            | filter isNotNull(tags)
            | fieldsRename name = entity.name`
  }
})};

export const processTagsQueryResult = (from, to) => { 
  return useDqlQuery({
  body: {
    query: `fetch dt.entity.process_group, from: "${from}", to: "${to}"
            | fieldsAdd tags
            | filter isNotNull(tags)
            | fieldsRename name = entity.name`
  }
})};

export const serviceTagsQueryResult = (from, to) => { 
  return useDqlQuery({
  body: {
    query: `fetch dt.entity.service, from: "${from}", to: "${to}"
            | fieldsAdd tags
            | filter isNotNull(tags)
            | fieldsRename name = entity.name`
  }
})};