import { SchedulingMatrixData } from "../../FileDownloading/types";

export const generatePreemptiveSJFMatrix = (processes): SchedulingMatrixData => {
    // Create working copy of processes with additional properties
    const workingProcesses = processes.map(proc => ({
      ...proc,
      remainingTime: proc.burstTime,
      startTime: undefined as number | undefined,
      completionTime: undefined as number | undefined,
      currentStartTime: undefined as number | undefined
    }));
  
    let currentTime = Math.min(...processes.map(p => p.arrivalTime));
    let completedProcesses = 0;
    let executionHistory: { time: number; processId: number; }[] = [];
    let currentProcess: typeof workingProcesses[0] | null = null;
  
    // Calculate execution timeline
    while (completedProcesses < processes.length) {
      // Get available processes at current time
      let availableProcesses = workingProcesses.filter(
        p => p.arrivalTime <= currentTime && p.remainingTime > 0
      );
  
      if (availableProcesses.length === 0) {
        // Jump to next process arrival if none available
        currentTime = Math.min(
          ...workingProcesses
            .filter(p => p.remainingTime > 0)
            .map(p => p.arrivalTime)
        );
        continue;
      }
  
      // Sort by remaining time (shortest first)
      availableProcesses.sort((a, b) => a.remainingTime - b.remainingTime);
  
      let nextProcess = availableProcesses[0];
  
      // Check if we should preempt current process
      if (currentProcess && currentProcess.remainingTime > 0) {
        if (nextProcess.remainingTime < currentProcess.remainingTime) {
          currentProcess = nextProcess;
        }
      } else {
        currentProcess = nextProcess;
      }
  
      // Update process timing information
      const processIndex = currentProcess.id - 1;
      if (workingProcesses[processIndex].startTime === undefined) {
        workingProcesses[processIndex].startTime = currentTime;
      }
      workingProcesses[processIndex].currentStartTime = currentTime;
  
      // Record execution at this time point
      executionHistory.push({
        time: currentTime,
        processId: currentProcess.id
      });
  
      // Execute for one time unit
      currentProcess.remainingTime--;
      currentTime++;
  
      // Check if process completed
      if (currentProcess.remainingTime === 0) {
        workingProcesses[processIndex].completionTime = currentTime;
        completedProcesses++;
        currentProcess = null;
      }
    }
  
    // Create execution matrix
    const maxTime = Math.max(...workingProcesses.map(p => p.completionTime!));
    const correctMatrix: string[][] = [];
  
    // Build state matrix for each process
    processes.forEach((process) => {
      const row: string[] = [];
      for (let t = 0; t <= maxTime; t++) {
        if (t < process.arrivalTime) {
          row.push("-"); // Not arrived
        } else if (t >= workingProcesses[process.id - 1].completionTime!) {
          row.push(""); // Completed
        } else {
          const isExecuting = executionHistory.find(
            h => h.time === t && h.processId === process.id
          );
          row.push(isExecuting ? "e" : "w"); // Executing or waiting
        }
      }
      correctMatrix.push(row);
    });
  
    // Create empty user matrix with same dimensions
    const userMatrix = correctMatrix.map(row => 
      Array(row.length).fill("")
    );
  
    return {
      correctMatrix,
      userMatrix
    };
  };