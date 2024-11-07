import { convertToTimeseries, Tab, Tabs, TimeseriesChart } from "@dynatrace/strato-components-preview";
import React from "react";

export const CustomTabs = (props) => {
  return (
    <>
      <Tabs defaultIndex={0}>
        <Tab title={props.title1}>
          <TimeseriesChart data={convertToTimeseries(props.RTRecords, props.RTTypes)} variant="line">
            <TimeseriesChart.XAxis
              min={props.start_time}
              max={props.end_time}
              label="Time"
            />
          </TimeseriesChart>
        </Tab>
        <Tab title={props.title2}>              
            <TimeseriesChart data={convertToTimeseries(props.FRRecords, props.FRTypes)} variant="bar">
              <TimeseriesChart.XAxis
                min={props.start_time}
                max={props.end_time}
                label="Time"
              />
            </TimeseriesChart>
        </Tab>
        <Tab title={props.title3}>                 
            <TimeseriesChart data={convertToTimeseries(props.CPURecords, props.CPUTypes)} variant="area">
              <TimeseriesChart.XAxis
                min={props.start_time}
                max={props.end_time}
                label="Time"
              />
            </TimeseriesChart>
        </Tab>
        <Tab title={props.title4}>
            <TimeseriesChart data={convertToTimeseries(props.TPRecords, props.TPTypes)} variant="bar">
              <TimeseriesChart.XAxis
                min={props.start_time}
                max={props.end_time}
                label="Time"
              />
            </TimeseriesChart>
        </Tab>
      </Tabs>
    </>
  )
}