export interface Process {
    id: number;
    arrivalTime: number;
    burstTime: number;
    completionTime?: number;
    turnaroundTime?: number;
    waitingTime?: number;
  }
  