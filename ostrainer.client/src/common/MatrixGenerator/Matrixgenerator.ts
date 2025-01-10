import { AlgorithmType } from "../AlgorithmType";
import { SchedulingMatrixData } from "../FileDownloading/types";
import { generateFCFSMatrix } from "./Scheduling/generateFCFS";
import { generateRRMatrix } from './Scheduling/generateRR';

export const generateSchedulingMatrixData = (
  arrivalTimes: string,
  burstTimes: string,
  timeQuantum: number | null,
  type: AlgorithmType
) => {
  const arrivalArray = arrivalTimes
      .replace(/\s+/g, "")
      .split(",")
      .map(Number);
    const burstArray = burstTimes.replace(/\s+/g, "").split(",").map(Number);

    const processList = arrivalArray.map((arrival, index) => ({
      id: index + 1,
      arrivalTime: arrival,
      burstTime: burstArray[index],
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
    case AlgorithmType.SJF_PREEMPTIVE: return generatePreemptiveSJFMatrix;
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

export const generatePreemptiveSJFMatrix = (arrivalTimes, burstTimes) => {
  let processes = arrivalTimes.map((arrival, index) => ({
    id: index + 1,
    arrivalTime: arrival,
    burstTime: burstTimes[index],
    remainingTime: burstTimes[index],
    startTime: undefined,
    completionTime: undefined,
    currentStartTime: undefined,
  }));

  let currentTime = Math.min(...arrivalTimes);
  let completedProcesses = 0;
  let executionHistory = [];
  let currentProcess = null;

  while (completedProcesses < processes.length) {
    let availableProcesses = processes.filter(
      (p) => p.arrivalTime <= currentTime && p.remainingTime > 0
    );

    if (availableProcesses.length === 0) {
      currentTime = Math.min(
        ...processes
          .filter((p) => p.remainingTime > 0)
          .map((p) => p.arrivalTime)
      );
      continue;
    }

    availableProcesses.sort((a, b) => a.remainingTime - b.remainingTime);

    let nextProcess = availableProcesses[0];

    if (currentProcess && currentProcess.remainingTime > 0) {
      if (nextProcess.remainingTime < currentProcess.remainingTime) {
        currentProcess = nextProcess;
      }
    } else {
      currentProcess = nextProcess;
    }

    if (processes[currentProcess.id - 1].startTime === undefined) {
      processes[currentProcess.id - 1].startTime = currentTime;
    }
    processes[currentProcess.id - 1].currentStartTime = currentTime;

    executionHistory.push({
      time: currentTime,
      processId: currentProcess.id,
    });

    currentProcess.remainingTime--;
    currentTime++;

    if (currentProcess.remainingTime === 0) {
      processes[currentProcess.id - 1].completionTime = currentTime;
      completedProcesses++;
      currentProcess = null;
    }
  }

  const maxTime = Math.max(...processes.map((p) => p.completionTime!));
  const matrix = [];

  processes.forEach((process) => {
    const row = [];
    for (let t = 0; t <= maxTime; t++) {
      if (t < process.arrivalTime) {
        row.push("-");
      } else if (t >= process.completionTime!) {
        row.push("");
      } else {
        const isExecuting = executionHistory.find(
          (h) => h.time === t && h.processId === process.id
        );
        if (isExecuting) {
          row.push("e");
        } else {
          row.push("w");
        }
      }
    }
    matrix.push(row);
  });

  return matrix;
};

