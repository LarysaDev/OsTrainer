import { SchedulingMatrixData } from "../FileDownloading/types";

export const generateFCFSMatrix = (processes): SchedulingMatrixData => {
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

  for (let i = 0; i < n; i++) {
    const row: string[] = [];
    const process = processes[i];
    const startTime = completionTimes[i] - process.burstTime;
    const endTime = completionTimes[i];

    for (let t = 0; t <= maxTime; t++) {
      if (t < process.arrivalTime) {
        row.push("-");  // Not arrived
      } else if (t >= startTime && t < endTime) {
        row.push("e");  // Executing
      } else if (t >= endTime) {
        row.push("");   // Completed
      } else {
        row.push("w");  // Waiting
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