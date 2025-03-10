import { SchedulingMatrixData } from "../../FileDownloading/types";

export const generateNonpreemptivePriorityMatrix = (
  processes,
  os: string
): SchedulingMatrixData => {
  // Створення робочої копії процесів
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
    // Доступні процеси
    let availableProcesses = workingProcesses.filter(
      (p) => p.arrivalTime <= currentTime && p.remainingTime > 0
    );

    if (availableProcesses.length === 0) {
      // Якщо немає доступних процесів, переходимо до наступного часу прибуття
      currentTime = Math.min(
        ...workingProcesses
          .filter((p) => p.remainingTime > 0)
          .map((p) => p.arrivalTime)
      );
      continue;
    }

    // Обираємо процес з найвищим пріоритетом
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

    // Якщо час старту ще не встановлено, встановлюємо його
    if (!workingProcesses[selectedProcess.id - 1].startTime) {
      workingProcesses[selectedProcess.id - 1].startTime = currentTime;
    }

    // Записуємо виконання процесу для всього часу його виконання
    for (
      let t = currentTime;
      t < currentTime + selectedProcess.remainingTime;
      t++
    ) {
      executionHistory.push({ time: t, processId: selectedProcess.id });
    }

    // Оновлюємо час завершення процесу
    currentTime += selectedProcess.remainingTime;
    workingProcesses[selectedProcess.id - 1].completionTime = currentTime;
    workingProcesses[selectedProcess.id - 1].remainingTime = 0;
    completedProcesses++;
  }

  // Створення матриці
  const maxTime = Math.max(...workingProcesses.map((p) => p.completionTime!));
  const minArrivalTime = Math.min(...processes.map((p) => p.arrivalTime));
  const correctMatrix: string[][] = [];

  // Побудова матриці станів
  processes.forEach((process) => {
    const row: string[] = [];
    for (let t = minArrivalTime; t <= maxTime; t++) {
      if (t < process.arrivalTime) {
        row.push("-"); // Процес ще не прибув
      } else if (t >= workingProcesses[process.id - 1].completionTime!) {
        row.push(""); // Процес завершено
      } else {
        const isExecuting = executionHistory.find(
          (h) => h.time === t && h.processId === process.id
        );
        row.push(isExecuting ? "e" : "w"); // Виконується або чекає
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
