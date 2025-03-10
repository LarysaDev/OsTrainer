import { SchedulingMatrixData } from "../../FileDownloading/types";

export const generateRRMatrix = (processes, timeQuantum: number): SchedulingMatrixData => {
  const workingProcesses = processes.map(proc => ({
      ...proc,
      remainingTime: proc.burstTime,
      inQueue: false,
      lastExecutionTime: -1
  }));

  let currentTime = Math.min(...processes.map(p => p.arrivalTime));
  let completed = 0;
  let queue: typeof workingProcesses = [];
  const correctMatrix: string[][] = processes.map(() => []);

  while (completed < processes.length) {
      workingProcesses.forEach(process => {
          if (process.arrivalTime <= currentTime && process.remainingTime > 0 && !process.inQueue) {
              queue.push(process);
              process.inQueue = true;
          }
      });

      if (queue.length === 0) {
          workingProcesses.forEach((_, index) => {
              correctMatrix[index].push("-");
          });
          currentTime++;
          continue;
      }

      const currentProcess = queue.shift()!;
      currentProcess.inQueue = false;

      const executeTime = Math.min(timeQuantum, currentProcess.remainingTime);

      for (let t = 0; t < executeTime; t++) {
          workingProcesses.forEach((process, index) => {
              if (process.id === currentProcess.id) {
                  correctMatrix[index].push("e");
              } else if (process.remainingTime === 0) {
                  correctMatrix[index].push("");
              } else if (process.arrivalTime <= currentTime) {
                  correctMatrix[index].push("w");
              } else {
                  correctMatrix[index].push("-");
              }
          });
          currentTime++;
          currentProcess.lastExecutionTime = currentTime;
      }

      currentProcess.remainingTime -= executeTime;

      if (currentProcess.remainingTime === 0) {
          completed++;
      } else {
          workingProcesses.forEach(process => {
              if (process.arrivalTime <= currentTime && process.remainingTime > 0 && !process.inQueue && process.id !== currentProcess.id) {
                  queue.push(process);
                  process.inQueue = true;
              }
          });
          queue.push(currentProcess);
          currentProcess.inQueue = true;
      }
  }

  const userMatrix = correctMatrix.map(row => row.map(() => ""));

  return {
      correctMatrix,
      userMatrix
  };
};
