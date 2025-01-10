import { SchedulingMatrixData } from "../../FileDownloading/types";

export const generateNonpreemptiveSJFMatrix = (processes): SchedulingMatrixData => {
    const workingProcesses = processes.map(proc => ({
      ...proc,
      completed: false
    }));
  
    const n = processes.length;
    const completionTimes: number[] = new Array(n).fill(0);
    const startTimes: number[] = new Array(n).fill(0);
  
    let currentTime = Math.min(...processes.map(p => p.arrivalTime));
    let completedProcesses = 0;
  
    // Calculate execution times
    while (completedProcesses < n) {
      let selectedProcess: number = -1;
      let shortestBurst = Number.MAX_VALUE;
  
      // Find process with shortest burst time among arrived processes
      for (let i = 0; i < n; i++) {
        if (!workingProcesses[i].completed && 
            workingProcesses[i].arrivalTime <= currentTime && 
            workingProcesses[i].burstTime < shortestBurst) {
          selectedProcess = i;
          shortestBurst = workingProcesses[i].burstTime;
        }
      }
  
      if (selectedProcess !== -1) {
        // Execute selected process
        startTimes[selectedProcess] = currentTime;
        completionTimes[selectedProcess] = currentTime + workingProcesses[selectedProcess].burstTime;
        currentTime = completionTimes[selectedProcess];
        workingProcesses[selectedProcess].completed = true;
        completedProcesses++;
      } else {
        // No process available, jump to next arrival
        let nextArrival = Number.MAX_VALUE;
        for (let i = 0; i < n; i++) {
          if (!workingProcesses[i].completed && workingProcesses[i].arrivalTime > currentTime) {
            nextArrival = Math.min(nextArrival, workingProcesses[i].arrivalTime);
          }
        }
        currentTime = nextArrival;
      }
    }
  
    // Create execution matrix
    const maxTime = Math.max(...completionTimes);
    const correctMatrix: string[][] = [];
  
    // Build state matrix for each process
    for (let i = 0; i < n; i++) {
      const row: string[] = [];
      for (let t = 0; t <= maxTime; t++) {
        if (t < processes[i].arrivalTime) {
          row.push("-");  // Not arrived
        } else if (t >= startTimes[i] && t < completionTimes[i]) {
          row.push("e");  // Executing
        } else if (t >= processes[i].arrivalTime && t < startTimes[i]) {
          row.push("w");  // Waiting
        } else if (t >= completionTimes[i]) {
          row.push("");   // Completed
        }
      }
      correctMatrix.push(row);
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