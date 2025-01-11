import { AlgorithmType } from "../AlgorithmType";
import { generateFCFSMatrix } from "./Scheduling/generateFCFS";
import { generateRRMatrix } from "./Scheduling/generateRR";
import { generateNonpreemptiveSJFMatrix } from "./Scheduling/generateSjfNon";
import { generatePreemptiveSJFMatrix } from "./Scheduling/generateSJFP";
import { generatePreemptivePriorityMatrix } from "./Scheduling/generatePriorityP";
import { generateNonpreemptivePriorityMatrix } from "./Scheduling/generatePriorityNon";
import { generateFIFOMatrixes } from "./Replacement/generateFIFO";
import { generateClockMatrixes } from "./Replacement/generateClock";

export const getMatrixGenerationLogic = (
  alg: AlgorithmType,
  processes,
  timeQuantum: number,
  pageRequests: number[],
  frameCount: number
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
      return generatePreemptivePriorityMatrix(processes);
    case AlgorithmType.PRIORITY_NON_PREEMPTIVE:
      return generateNonpreemptivePriorityMatrix(processes);
    case AlgorithmType.FIFO:
      return generateFIFOMatrixes(pageRequests, frameCount);
    case AlgorithmType.CLOCK:
      return generateClockMatrixes(pageRequests, frameCount)
  }
};
