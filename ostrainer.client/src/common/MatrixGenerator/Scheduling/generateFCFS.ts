import { SchedulingMatrixData } from "../../FileDownloading/types";

export const generateFCFSMatrix = (processes): SchedulingMatrixData => {
  console.log(processes);
  const n = processes.length;
  const correctMatrix: string[][] = [];
  const completionTimes = new Array(n).fill(0);
  
  const processesWithIndex = processes.map((process, index) => ({
    ...process,
    originalIndex: index,
  }));
  
  const sortedProcesses = [...processesWithIndex].sort(
    (a, b) => a.arrivalTime - b.arrivalTime
  );

  let currentTime = 0;
  for (let i = 0; i < n; i++) {
    const process = sortedProcesses[i];
    if (currentTime < process.arrivalTime) {
      currentTime = process.arrivalTime;
    }
    currentTime += process.burstTime;
    completionTimes[process.originalIndex] = currentTime;
  }

  const maxTime = Math.max(...completionTimes);
  const minArrivalTime = Math.min(...processes.map(p => p.arrivalTime));

  for (let i = 0; i < n; i++) {
    const row: string[] = [];
    const process = processes[i];
    const startTime = completionTimes[i] - process.burstTime;
    const endTime = completionTimes[i];

    for (let t = minArrivalTime; t <= maxTime; t++) {
      if (t < process.arrivalTime) {
        row.push("-");  
      } else if (t >= startTime && t < endTime) {
        row.push("e");
      } else if (t >= endTime) {
        row.push(""); 
      } else {
        row.push("w"); 
      }
    }
    correctMatrix.push(row);
  }

  const userMatrix = correctMatrix.map(row =>
    row.map(() => "") 
  );

  return {
    correctMatrix,
    userMatrix
  };
};
