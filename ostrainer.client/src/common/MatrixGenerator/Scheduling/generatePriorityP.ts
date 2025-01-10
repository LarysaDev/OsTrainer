import { SchedulingMatrixData } from "../../FileDownloading/types";

export const generatePreemptivePriorityMatrix = (
    processes
  ): SchedulingMatrixData => {
    const workingProcesses = processes.map(proc => ({
      ...proc,
      remainingTime: proc.burstTime,
      completionTime: undefined as number | undefined,
      startTime: undefined as number | undefined,
      currentStartTime: undefined as number | undefined
    }));
  
    let currentTime = Math.min(...processes.map(p => p.arrivalTime));
    let completedProcesses = 0;
    let executionHistory: { time: number; processId: number }[] = [];
    let currentProcess: typeof workingProcesses[0] | null = null;
  
    while (completedProcesses < processes.length) {
      // Get available processes
      let availableProcesses = workingProcesses.filter(
        p => p.arrivalTime <= currentTime && p.remainingTime > 0
      );
  
      if (availableProcesses.length === 0) {
        currentTime = Math.min(
          ...workingProcesses
            .filter(p => p.remainingTime > 0)
            .map(p => p.arrivalTime)
        );
        continue;
      }
  
      // Get highest priority process (lower number = higher priority)
      let highestPriorityProcess = availableProcesses.reduce((prev, current) =>
        prev.priority <= current.priority ? prev : current
      );
  
      // Check for preemption
      if (currentProcess && currentProcess.remainingTime > 0) {
        if (highestPriorityProcess.priority < currentProcess.priority) {
          currentProcess = highestPriorityProcess;
        }
      } else {
        currentProcess = highestPriorityProcess;
      }
  
      // Update process timing
      const processIndex = currentProcess.id - 1;
      if (workingProcesses[processIndex].startTime === undefined) {
        workingProcesses[processIndex].startTime = currentTime;
      }
      workingProcesses[processIndex].currentStartTime = currentTime;
  
      // Record execution
      executionHistory.push({
        time: currentTime,
        processId: currentProcess.id
      });
  
      currentProcess.remainingTime--;
      currentTime++;
  
      if (currentProcess.remainingTime === 0) {
        workingProcesses[processIndex].completionTime = currentTime;
        completedProcesses++;
        currentProcess = null;
      }
    }
  
    // Create matrix
    const maxTime = Math.max(...workingProcesses.map(p => p.completionTime!));
    const correctMatrix: string[][] = [];
  
    // Build state matrix
    processes.forEach(process => {
      const row: string[] = [];
      for (let t = 0; t <= maxTime; t++) {
        if (t < process.arrivalTime) {
          row.push("-");
        } else if (t >= workingProcesses[process.id - 1].completionTime!) {
          row.push("");
        } else {
          const isExecuting = executionHistory.find(
            h => h.time === t && h.processId === process.id
          );
          row.push(isExecuting ? "e" : "w");
        }
      }
      correctMatrix.push(row);
    });
  
    const userMatrix = correctMatrix.map(row => Array(row.length).fill(""));
  
    return { correctMatrix, userMatrix };
  };