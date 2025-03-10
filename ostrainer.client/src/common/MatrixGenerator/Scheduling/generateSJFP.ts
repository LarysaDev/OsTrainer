import { SchedulingMatrixData } from "../../FileDownloading/types";

export const generatePreemptiveSJFMatrix = (processes): SchedulingMatrixData => {
  let workingProcesses = processes.map((proc) => ({
    ...proc,
    remainingTime: proc.burstTime,
    startTime: undefined as number | undefined,
    completionTime: undefined as number | undefined,
    currentStartTime: undefined as number | undefined,
  }));

  const minArrivalTime = Math.min(...processes.map((p) => p.arrivalTime));
  let currentTime = minArrivalTime;
  let completedProcesses = 0;
  let executionHistory: { time: number; processId: number }[] = [];
  let currentProcess: typeof workingProcesses[0] | null = null;

  while (completedProcesses < processes.length) {
    let availableProcesses = workingProcesses.filter(
      (p) => p.arrivalTime <= currentTime && p.remainingTime > 0
    );

    if (availableProcesses.length === 0) {
      currentTime = Math.min(
        ...workingProcesses
          .filter((p) => p.remainingTime > 0)
          .map((p) => p.arrivalTime)
      );
      continue;
    }

    availableProcesses.sort((a, b) => a.remainingTime - b.remainingTime);

    let nextProcess = availableProcesses[0];

    if (currentProcess && currentProcess.remainingTime > 0) {
      if (nextProcess.remainingTime < currentProcess.remainingTime) {
        currentProcess = nextProcess;
      }
    } else {
      currentProcess = nextProcess;
    }

    if (workingProcesses[currentProcess.id - 1].startTime === undefined) {
      workingProcesses[currentProcess.id - 1].startTime = currentTime;
    }

    workingProcesses[currentProcess.id - 1].currentStartTime = currentTime;

    executionHistory.push({
      time: currentTime,
      processId: currentProcess.id,
    });

    currentProcess.remainingTime--;
    currentTime++;

    if (currentProcess.remainingTime === 0) {
      workingProcesses[currentProcess.id - 1].completionTime = currentTime;
      completedProcesses++;
      currentProcess = null;
    }
  }

  const maxTime = Math.max(...workingProcesses.map((p) => p.completionTime!));

  const matrix: (string | number)[][] = [];

  processes.forEach((process) => {
    const row: (string | number)[] = [];

    for (let t = minArrivalTime; t <= maxTime; t++) {
      if (t < process.arrivalTime) {
        row.push("-"); 
      } else if (t >= workingProcesses[process.id - 1].completionTime!) {
        row.push("");
      } else {
        const isExecuting = executionHistory.find(
          (h) => h.time === t && h.processId === process.id
        );
        row.push(isExecuting ? "e" : "w");
      }
    }
    matrix.push(row);
  });

  return {
    correctMatrix: matrix,
    userMatrix: matrix
  };
};
