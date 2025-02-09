import { AlgorithmType } from "../AlgorithmType";
import { generateFCFSMatrix } from "./Scheduling/generateFCFS";
import { generateRRMatrix } from "./Scheduling/generateRR";
import { generateNonpreemptiveSJFMatrix } from "./Scheduling/generateSjfNon";
import { generatePreemptiveSJFMatrix } from "./Scheduling/generateSJFP";
import { generatePreemptivePriorityMatrix } from "./Scheduling/generatePriorityP";
import { generateNonpreemptivePriorityMatrix } from "./Scheduling/generatePriorityNon";
import { generateFIFOMatrixes } from "./Replacement/generateFIFO";
import { generateClockMatrixes } from "./Replacement/generateClock";
import { generateLRUMatrixes } from "./Replacement/generateLRU";
import { generateMFUMatrixes } from "./Replacement/generateMFU";
import { generateLFUMatrixes } from "./Replacement/generateLFU";

export const getMatrixGenerationLogic = (
  alg: AlgorithmType,
  processes,
  timeQuantum: number,
  pageRequests: number[],
  frameCount: number,
  os: string | null
) => {
  switch (alg) {
    case AlgorithmType.FCFS:
      return generateFCFSMatrix(processes);
    case AlgorithmType.RR:
      return generateRRMatrix(processes, timeQuantum);
    case AlgorithmType.SJF_NON_PREEMPTIVE:
      return generateNonpreemptiveSJFMatrix(processes);
    case AlgorithmType.SJF_PREEMPTIVE:
      return generatePreemptiveSJFMatrix(processes);
    case AlgorithmType.PRIORITY_PREEMPTIVE:
      return generatePreemptivePriorityMatrix(processes, os as string);
    case AlgorithmType.PRIORITY_NON_PREEMPTIVE:
      return generateNonpreemptivePriorityMatrix(processes, os as string);
    case AlgorithmType.FIFO:
      return generateFIFOMatrixes(pageRequests, frameCount);
    case AlgorithmType.CLOCK:
      return generateClockMatrixes(pageRequests, frameCount);
    case AlgorithmType.LRU: 
      return generateLRUMatrixes(pageRequests, frameCount, false);
    case AlgorithmType.LRU_STACK:
      return generateLRUMatrixes(pageRequests, frameCount, true);
    case AlgorithmType.LFU:
      return generateLFUMatrixes(pageRequests, frameCount);
    case AlgorithmType.MFU:
      return generateMFUMatrixes(pageRequests, frameCount);
  }
};
