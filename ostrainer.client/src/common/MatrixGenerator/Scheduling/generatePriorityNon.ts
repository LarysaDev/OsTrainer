import { SchedulingMatrixData } from "../../FileDownloading/types";

export const generateNonpreemptivePriorityMatrix = (
  processes,
  os: string
): SchedulingMatrixData => {
  const workingProcesses = processes.map((proc) => ({
    ...proc,
    remainingTime: proc.burstTime,
    completionTime: undefined as number | undefined,
    startTime: undefined as number | undefined,
  }));

  let currentTime = Math.min(...processes.map((p) => p.arrivalTime));
  let completedProcesses = 0;
  let executionHistory: { time: number; processId: number }[] = [];

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

    let selectedProcess;
    if (os === "Windows") {
      selectedProcess = availableProcesses.reduce((prev, current) =>
        prev.priority >= current.priority ? prev : current
      );
    } else {
      selectedProcess = availableProcesses.reduce((prev, current) =>
        prev.priority <= current.priority ? prev : current
      );
    }

    if (!workingProcesses[selectedProcess.id - 1].startTime) {
      workingProcesses[selectedProcess.id - 1].startTime = currentTime;
    }

    for (
      let t = currentTime;
      t < currentTime + selectedProcess.remainingTime;
      t++
    ) {
      executionHistory.push({ time: t, processId: selectedProcess.id });
    }

    currentTime += selectedProcess.remainingTime;
    workingProcesses[selectedProcess.id - 1].completionTime = currentTime;
    workingProcesses[selectedProcess.id - 1].remainingTime = 0;
    completedProcesses++;
  }

  const maxTime = Math.max(...workingProcesses.map((p) => p.completionTime!));
  const minArrivalTime = Math.min(...processes.map((p) => p.arrivalTime));
  const correctMatrix: string[][] = [];

  processes.forEach((process) => {
    const row: string[] = [];
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
    correctMatrix.push(row);
  });

  const userMatrix = correctMatrix.map((row) =>
    Array(row.length).fill("")
  );

  return {
    correctMatrix,
    userMatrix,
  };
};
