export enum AlgorithmType {
  FCFS = "FCFS",
  RR = "Round-Robin",
  SJF_NON_PREEMPTIVE = "SJF (невитісняючий)",
  SJF_PREEMPTIVE = "SJF (витісняючий)",
  PRIORITY_NON_PREEMPTIVE = "Priority (невитісняючий)",
  PRIORITY_PREEMPTIVE = "Priority (витісняючий)",
  FIFO = "FIFO",
  CLOCK = "Clock",
  LRU = "LRU",
  LRU_STACK = "LRU (стек)",
  LFU = "LFU",
  MFU = "MFU",
  BANKER = "Банкіра"
} 


const schedulingAlorithms: AlgorithmType[] = [
  AlgorithmType.FCFS,
  AlgorithmType.RR,
  AlgorithmType.SJF_PREEMPTIVE,
  AlgorithmType.SJF_NON_PREEMPTIVE,
  AlgorithmType.PRIORITY_NON_PREEMPTIVE,
  AlgorithmType.PRIORITY_PREEMPTIVE,
];
const replacementAlgorithms: AlgorithmType[] = [
  AlgorithmType.FIFO,
  AlgorithmType.LFU,
  AlgorithmType.CLOCK,
  AlgorithmType.LRU,
  AlgorithmType.MFU,
  AlgorithmType.LRU_STACK,
];
const deadlockAvoidAlgorithms: AlgorithmType[] = [AlgorithmType.BANKER];

export const isSchedulingType = (alg: AlgorithmType) => schedulingAlorithms.includes(alg);
export const isReplacingType = (alg: AlgorithmType) => replacementAlgorithms.includes(alg);
export const isDeadlockAvoiding = (alg: AlgorithmType) => deadlockAvoidAlgorithms.includes(alg);
