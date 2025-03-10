import { SchedulingMatrixData } from "../../FileDownloading/types";

export const generateRRMatrix = (processes, timeQuantum: number): SchedulingMatrixData => {
  const workingProcesses = processes.map(proc => ({
      ...proc,
      remainingTime: proc.burstTime,
      inQueue: false,
      lastExecutionTime: -1
  }));

  // Find minimum arrival time
  const minArrivalTime = Math.min(...processes.map(p => p.arrivalTime));
  
  // Current time should start at the minimum arrival time (1 in your case)
  let currentTime = minArrivalTime;
  let completed = 0;
  let queue: typeof workingProcesses = [];
  const correctMatrix: string[][] = processes.map(() => []);
  
  // Pre-fill matrix with "-" for times before the first arrival
  for (let t = 0; t < minArrivalTime; t++) {
      workingProcesses.forEach((_, index) => {
          correctMatrix[index].push("-");
      });
  }

  while (completed < processes.length) {
      // Add newly arrived processes to queue
      workingProcesses.forEach(process => {
          if (process.arrivalTime <= currentTime && process.remainingTime > 0 && !process.inQueue) {
              queue.push(process);
              process.inQueue = true;
          }
      });

      if (queue.length === 0) {
          // If no process is ready, add "-" for idle time
          workingProcesses.forEach((_, index) => {
              correctMatrix[index].push("-");
          });
          currentTime++;
          continue;
      }

      // Get next process from queue (FIFO)
      const currentProcess = queue.shift()!;
      currentProcess.inQueue = false;

      // Execute for time quantum or remaining time
      const executeTime = Math.min(timeQuantum, currentProcess.remainingTime);

      // Update matrix for the execution period
      for (let t = 0; t < executeTime; t++) {
          workingProcesses.forEach((process, index) => {
              if (process.id === currentProcess.id) {
                  correctMatrix[index].push("e"); // Process is executing
              } else if (process.remainingTime === 0) {
                  correctMatrix[index].push(""); // Process is completed
              } else if (process.arrivalTime <= currentTime) {
                  correctMatrix[index].push("w"); // Process is waiting
              } else {
                  correctMatrix[index].push("-"); // Process not arrived yet
              }
          });
          currentTime++; // Increment time after each tick
      }

      // Update remaining time of the current process
      currentProcess.remainingTime -= executeTime;
      currentProcess.lastExecutionTime = currentTime - 1;

      // Add newly arrived processes first
      workingProcesses.forEach(process => {
          if (process.arrivalTime <= currentTime && process.remainingTime > 0 && !process.inQueue) {
              queue.push(process);
              process.inQueue = true;
          }
      });

      // Handle process completion or re-queueing
      if (currentProcess.remainingTime === 0) {
          completed++;
      } else {
          // Re-add the current process to the end of the queue
          queue.push(currentProcess);
          currentProcess.inQueue = true;
      }
  }

  // Create empty user matrix with same dimensions
  const userMatrix = correctMatrix.map(row => row.map(() => ""));

  return {
      correctMatrix,
      userMatrix
  };
};