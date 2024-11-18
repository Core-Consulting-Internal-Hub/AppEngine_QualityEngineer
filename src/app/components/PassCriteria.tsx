import React from "react";

export const PassCriteria = (props) => {
  const marks = Array<{ category: string; score: 0 | 1; threshold: number; unit: string}>();

    const addMark = (category: string, values: any[][], threshold: number, unit: string) => {
      const score = values?.some(item => 
          Array.isArray(item) && item.some(value => value != null && value >= threshold)
      ) ? 0 : 1;
  
      marks.push({ category, score, threshold, unit });
    };

    addMark("error", props.error, 1, "");
    addMark("meantime", props.meantime, 99.99, "ms");
    addMark("cpu", props.cpuUsage, 95.0, "%");
    addMark("memory", props.memoryUsage, 95.0, "%");

    return marks;
}