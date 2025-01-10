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
      // Add newly arrived processes to queue
      workingProcesses.forEach(process => {
        if (process.arrivalTime <= currentTime && 
            process.remainingTime > 0 && 
            !process.inQueue) {
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
  
      // Get next process
      const currentProcess = queue.shift()!;
      currentProcess.inQueue = false;
  
      // Execute for time quantum or remaining time
      const executeTime = Math.min(timeQuantum, currentProcess.remainingTime);
  
      // Update states during execution
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
  
      // Update remaining time
      currentProcess.remainingTime -= executeTime;
  
      // Handle process completion or re-queueing
      if (currentProcess.remainingTime === 0) {
        completed++;
      } else {
        // Check for any new arrivals before re-queueing
        workingProcesses.forEach(process => {
          if (process.arrivalTime <= currentTime && 
              process.remainingTime > 0 && 
              !process.inQueue && 
              process.id !== currentProcess.id) {
            queue.push(process);
            process.inQueue = true;
          }
        });
        // Add current process back to queue
        queue.push(currentProcess);
        currentProcess.inQueue = true;
      }
    }
  
    // Create empty user matrix with same dimensions
    const userMatrix = correctMatrix.map(row => 
      Array(row.length).fill("")
    );
  
    return {
      correctMatrix,
      userMatrix
    };
  };