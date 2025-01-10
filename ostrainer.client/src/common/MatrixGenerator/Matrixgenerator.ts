import { AlgorithmType } from "../AlgorithmType";
import { SchedulingMatrixData } from "../FileDownloading/types";
import { generateFCFSMatrix } from "./Scheduling/generateFCFS";
import { generateRRMatrix } from './Scheduling/generateRR';
import { generateNonpreemptiveSJFMatrix } from "./Scheduling/generateSjfNon";
import { generatePreemptiveSJFMatrix } from "./Scheduling/generateSJFP";
import { generatePreemptivePriorityMatrix } from "./Scheduling/generatePriorityP";
import { generateNonpreemptivePriorityMatrix } from "./Scheduling/generatePriorityNon";

export const generateSchedulingMatrixData = (
  arrivalTimes: string,
  burstTimes: string,
  priorities: string,
  timeQuantum: number | null,
  type: AlgorithmType
) => {
  const arrivalArray = arrivalTimes
      .replace(/\s+/g, "")
      .split(",")
      .map(Number);
    const burstArray = burstTimes.replace(/\s+/g, "").split(",").map(Number);
    const priorityArray = priorities.replace(/\s+/g, "").split(",").map(Number);

    const processList = arrivalArray.map((arrival, index) => ({
      id: index + 1,
      arrivalTime: arrival,
      burstTime: burstArray[index],
      priority: priorityArray[index]
    }));

  const matrixes: SchedulingMatrixData = getMatrixGenerationLogic(type, processList, timeQuantum ?? 0);

  const maxTime = matrixes.userMatrix[0].length;
  const processedCount = arrivalArray.length;
  
  const timeUnits = Array.from({ length: maxTime }, (_, i) => i);

  console.log(matrixes)

  const userMatrixTemplate: (string | number)[][] = [
    ["Process\Time1", ...timeUnits],
    ...Array.from({ length: processedCount }, (_, index) => [
      `P${index + 1}`,
      ...Array.from({ length: maxTime }, () => ""),
    ]),
  ];

  const updatedCorrectMatrix = [
    ["Process\Time", ...timeUnits],
    ...Array.from({ length: processedCount }, (_, processIndex) => [
      `P${processIndex + 1}`,
      ...timeUnits.map((_, requestIndex) => matrixes.correctMatrix[processIndex][requestIndex] ?? null),
    ]),
  ];

  return {
    correctMatrix: updatedCorrectMatrix,
    userMatrix: userMatrixTemplate,
  };
};

export const getMatrixGenerationLogic = (alg: AlgorithmType, processes, timeQuantum: number) => {
  switch (alg) {
    case AlgorithmType.FCFS: return generateFCFSMatrix(processes);
    case AlgorithmType.RR: return generateRRMatrix(processes, timeQuantum);
    case AlgorithmType.SJF_NON_PREEMPTIVE: return generateNonpreemptiveSJFMatrix(processes);
    case AlgorithmType.SJF_PREEMPTIVE: return generatePreemptiveSJFMatrix(processes);
    case AlgorithmType.PRIORITY_PREEMPTIVE: return generatePreemptivePriorityMatrix(processes);
    case AlgorithmType.PRIORITY_NON_PREEMPTIVE: return generateNonpreemptivePriorityMatrix(processes);
    case AlgorithmType.FIFO: return generateFIFOMatrix;
  }
}


export const generateFIFOMatrix = (
  pageRequests: number[],
  frameCount: number
) => {
  const matrix = Array.from({ length: frameCount }, () =>
    new Array(pageRequests.length).fill(null)
  );
  const frames: number[] = [];
  const pageFaults: boolean[] = [];

  pageRequests.forEach((page, columnIndex) => {
    const isPagePresent = frames.includes(page);

    if (!isPagePresent) {
      pageFaults.push(true);

      if (frames.length < frameCount) {
        frames.unshift(page);
      } else {
        frames.pop();
        frames.unshift(page);
      }
    } else {
      pageFaults.push(false);
    }

    for (let i = 0; i < frameCount; i++) {
      matrix[i][columnIndex] = frames[i] ?? null;
    }
  });

  return { matrix, pageFaults };
};


