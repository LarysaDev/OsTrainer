import { AlgorithmType } from "../AlgorithmType";
import { SchedulingMatrixData } from "../FileDownloading/types";
import { generateFCFSMatrix } from "./Scheduling/generateFCFS";

export const generateSchedulingMatrixData = (
  arrivalTimes: string,
  burstTimes: string,
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

  const generateMatrixLogic = getMatrixGenerationLogic(type);
  const matrixes: SchedulingMatrixData = generateMatrixLogic(processList);

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

export const getMatrixGenerationLogic = (alg: AlgorithmType) => {
  switch (alg) {
    case AlgorithmType.FCFS: return generateFCFSMatrix;
    case AlgorithmType.RR: return generateRRMatrix;
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

export const generateRRMatrix = (arrivalTimes, burstTimes, timeQuantum) => {
  const processes = arrivalTimes.map((at, index) => ({
      id: index + 1,
      arrivalTime: at,
      burstTime: burstTimes[index],
      remainingTime: burstTimes[index],
      states: []
  }));

  let currentTime = 0;
  let completed = 0;
  let queue = [];
  let statesMatrix = [["Process\\Time"]];

  processes.forEach((process, index) => {
      statesMatrix.push([`P${index + 1}`]);
  });

  while (completed < processes.length) {
      for (let i = 0; i < processes.length; i++) {
          if (processes[i].arrivalTime <= currentTime &&
              processes[i].remainingTime > 0 &&
              !queue.includes(processes[i]) &&
              !processes[i].inQueue) {
              queue.push(processes[i]);
              processes[i].inQueue = true;
          }
      }

      if (queue.length === 0) {
          processes.forEach((process, index) => {
              statesMatrix[index + 1].push("-");
          });
          currentTime++;
          continue;
      }

      let currentProcess = queue.shift();
      currentProcess.inQueue = false;

      const executeTime = Math.min(timeQuantum, currentProcess.remainingTime);

      for (let t = 0; t < executeTime; t++) {
          processes.forEach((process, index) => {
              let state;
              if (process.id === currentProcess.id) {
                  state = "e"; 
              } else if (process.remainingTime === 0) {
                  state = ""; 
              } else if (process.arrivalTime <= currentTime + t && process.remainingTime > 0) {
                  state = "w";
              } else {
                  state = "-";
              }
              statesMatrix[index + 1].push(state);
          });
      }

      currentProcess.remainingTime -= executeTime;
      currentTime += executeTime;

      if (currentProcess.remainingTime === 0) {
          completed++;
          const processIndex = currentProcess.id - 1;
          while (statesMatrix[processIndex + 1].length < statesMatrix[0].length) {
              statesMatrix[processIndex + 1].push("X");
          }
      } else {
          queue.push(currentProcess);
          currentProcess.inQueue = true;
      }
  }

  const timeHeader = Array.from({ length: currentTime + 1 }, (_, i) => i);
  statesMatrix[0] = [...statesMatrix[0], ...timeHeader];

  const maxLength = statesMatrix[0].length;
  for (let i = 1; i < statesMatrix.length; i++) {
      while (statesMatrix[i].length < maxLength) {
          statesMatrix[i].push("");
      }
  }

  return statesMatrix;
}

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

