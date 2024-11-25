import React from "react";

export const PassCriteria = (props) => {
  const marks = Array<{ category: string; score: 0 | 1; threshold: number; unit: string}>();

    const addMark = (category: string, values: any[][], threshold: number, unit: string) => {
      const score = values?.some(item => 
          Array.isArray(item) && item.some(value => value != null && value >= threshold)
      ) ? 0 : 1;
  
      marks.push({ category, score, threshold, unit });
    };

    addMark("Failure Rate", props.error, 101, "");
    addMark("Response Time", props.meantime, 99999999.99, "ms");
    addMark("CPU Usage", props.cpuUsage, 95.0, "%");
    addMark("Memory Usage", props.memoryUsage, 95.0, "%");

    return marks;
}