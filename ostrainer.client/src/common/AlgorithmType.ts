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