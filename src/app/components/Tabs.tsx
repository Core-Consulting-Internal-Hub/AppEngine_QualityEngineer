import { Flex } from "@dynatrace/strato-components";
import { convertToTimeseries, Tab, Tabs, TimeseriesChart } from "@dynatrace/strato-components-preview";
import React from "react";

export const CustomTabs = (props) => {
  return (
    <>
      <Tabs defaultIndex={0}>
        <Tab title={props.title1}>
          <TimeseriesChart data={convertToTimeseries(props.RTRecords, props.RTTypes)} variant="line"></TimeseriesChart>
        </Tab>
        <Tab title={props.title2}>
          <Flex flexDirection="column">                   
            <TimeseriesChart data={convertToTimeseries(props.FRRecords, props.FRTypes)} variant="line"></TimeseriesChart>
          </Flex>
        </Tab>
        <Tab title={props.title3}>
          <Flex flexDirection="column">                 
            <TimeseriesChart data={convertToTimeseries(props.CPURecords, props.CPUTypes)} variant="area"></TimeseriesChart>
          </Flex>
        </Tab>
        <Tab title={props.title4}>
          <Flex flexDirection="column">
            <TimeseriesChart data={convertToTimeseries(props.TPRecords, props.TPTypes)} variant="bar"></TimeseriesChart>
          </Flex>
        </Tab>
      </Tabs>
    </>
  )
}