import { SchedulingMatrixData } from "../../FileDownloading/types";

export const generateNonpreemptiveSJFMatrix = (processes): SchedulingMatrixData => {
  const workingProcesses = processes.map(proc => ({
    ...proc,
    remainingTime: proc.burstTime,
    completed: false,
    startTime: undefined,
    completionTime: undefined,
  }));

  const n = processes.length;
  const completionTimes: number[] = new Array(n).fill(0);
  const startTimes: number[] = new Array(n).fill(0);

  let currentTime = Math.min(...processes.map(p => p.arrivalTime));
  let completedProcesses = 0;

  while (completedProcesses < n) {
    let selectedProcess: number = -1;
    let shortestBurst = Number.MAX_VALUE;

    for (let i = 0; i < n; i++) {
      if (
        !workingProcesses[i].completed &&
        workingProcesses[i].arrivalTime <= currentTime &&
        workingProcesses[i].remainingTime < shortestBurst
      ) {
        selectedProcess = i;
        shortestBurst = workingProcesses[i].remainingTime;
      }
    }

    if (selectedProcess !== -1) {
      startTimes[selectedProcess] = currentTime;
      completionTimes[selectedProcess] = currentTime + workingProcesses[selectedProcess].burstTime;
      currentTime = completionTimes[selectedProcess];
      workingProcesses[selectedProcess].completed = true;
      workingProcesses[selectedProcess].completionTime = completionTimes[selectedProcess];
      completedProcesses++;
    } else {
      let nextArrival = Math.min(...workingProcesses.filter(p => !p.completed && p.arrivalTime > currentTime).map(p => p.arrivalTime));
      currentTime = nextArrival;
    }
  }

  const maxTime = Math.max(...completionTimes);
  const correctMatrix: string[][] = [];

  for (let i = 0; i < n; i++) {
    const row: string[] = [];
    for (let t = Math.min(...processes.map(p => p.arrivalTime)); t <= maxTime; t++) {
      if (t < processes[i].arrivalTime) {
        row.push("-"); 
      } else if (t >= startTimes[i] && t < completionTimes[i]) {
        row.push("e");
      } else if (t >= processes[i].arrivalTime && t < startTimes[i]) {
        row.push("w");
      } else {
        row.push("");
      }
    }
    correctMatrix.push(row);
  }

  const userMatrix = correctMatrix.map(row =>
    row.map(cell => (cell === "e" ? "" : cell))
  );

  return {
    correctMatrix,
    userMatrix
  };
};

