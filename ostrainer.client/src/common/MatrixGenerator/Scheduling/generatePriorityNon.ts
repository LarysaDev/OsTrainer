import { SchedulingMatrixData } from "../../FileDownloading/types";

export const generateNonpreemptivePriorityMatrix = (
    processes
  ): SchedulingMatrixData => {
    // Create working copy of processes
    const workingProcesses = processes.map(proc => ({
      ...proc,
      remainingTime: proc.burstTime,
      completionTime: undefined as number | undefined,
      startTime: undefined as number | undefined
    }));
  
    let currentTime = Math.min(...processes.map(p => p.arrivalTime));
    let completedProcesses = 0;
    let executionHistory: { time: number; processId: number }[] = [];
  
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
  
      // Get highest priority process
      let selectedProcess = availableProcesses.reduce((prev, current) =>
        prev.priority <= current.priority ? prev : current
      );
  
      // Set start time if not set
      if (!workingProcesses[selectedProcess.id - 1].startTime) {
        workingProcesses[selectedProcess.id - 1].startTime = currentTime;
      }
  
      // Record execution for entire burst
      for (let t = currentTime; t < currentTime + selectedProcess.remainingTime; t++) {
        executionHistory.push({ time: t, processId: selectedProcess.id });
      }
  
      // Update process completion
      currentTime += selectedProcess.remainingTime;
      workingProcesses[selectedProcess.id - 1].completionTime = currentTime;
      workingProcesses[selectedProcess.id - 1].remainingTime = 0;
      completedProcesses++;
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