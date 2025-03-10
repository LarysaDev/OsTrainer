import { SchedulingMatrixData } from "../../FileDownloading/types";

export const generatePreemptiveSJFMatrix = (processes): SchedulingMatrixData => {
  // Створюємо робочу копію процесів з додатковими властивостями
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

  // Обчислюємо час виконання процесів
  while (completedProcesses < processes.length) {
    // Отримуємо доступні процеси на поточний момент часу
    let availableProcesses = workingProcesses.filter(
      p => p.arrivalTime <= currentTime && p.remainingTime > 0
    );

    if (availableProcesses.length === 0) {
      // Якщо немає доступних процесів, переходимо до наступного часу прибуття
      currentTime = Math.min(
        ...workingProcesses
          .filter(p => p.remainingTime > 0)
          .map(p => p.arrivalTime)
      );
      continue;
    }

    // Сортуємо за залишковим часом (найкоротший спочатку)
    availableProcesses.sort((a, b) => a.remainingTime - b.remainingTime);

    let nextProcess = availableProcesses[0];

    // Перевіряємо, чи потрібно витісняти поточний процес
    if (currentProcess && currentProcess.remainingTime > 0) {
      if (nextProcess.remainingTime < currentProcess.remainingTime) {
        // Витісняємо поточний процес, якщо наступний має менший час виконання
        executionHistory.push({
          time: currentTime,
          processId: currentProcess.id
        });
        currentProcess.remainingTime--; // Зменшуємо час залишку для поточного процесу
      } else {
        // В іншому випадку, продовжуємо виконання поточного процесу
        executionHistory.push({
          time: currentTime,
          processId: currentProcess.id
        });
        currentProcess.remainingTime--;
      }
    } else {
      // Якщо немає поточного процесу, просто розпочинаємо новий
      currentProcess = nextProcess;
    }

    // Оновлюємо інформацію про процес
    const processIndex = currentProcess.id - 1;
    if (workingProcesses[processIndex].startTime === undefined) {
      workingProcesses[processIndex].startTime = currentTime;
    }
    workingProcesses[processIndex].currentStartTime = currentTime;

    // Якщо процес завершив виконання
    if (currentProcess.remainingTime === 0) {
      workingProcesses[processIndex].completionTime = currentTime;
      completedProcesses++;
      currentProcess = null;
    }

    // Переходимо до наступного часу
    currentTime++;
  }

  // Створюємо матрицю виконання
  const maxTime = Math.max(...workingProcesses.map(p => p.completionTime!));
  const correctMatrix: string[][] = [];

  // Створюємо матрицю станів для кожного процесу
  processes.forEach((process) => {
    const row: string[] = [];
    for (let t = 0; t <= maxTime; t++) {
      if (t < process.arrivalTime) {
        row.push("-"); // Процес ще не прибув
      } else if (t >= workingProcesses[process.id - 1].completionTime!) {
        row.push(""); // Процес завершено
      } else {
        const isExecuting = executionHistory.find(
          h => h.time === t && h.processId === process.id
        );
        row.push(isExecuting ? "e" : "w"); // Виконується або чекає
      }
    }
    correctMatrix.push(row);
  });

  // Створюємо порожню користувацьку матрицю з тими ж розмірами
  const userMatrix = correctMatrix.map(row => 
    Array(row.length).fill("")
  );

  return {
    correctMatrix,
    userMatrix
  };
};
