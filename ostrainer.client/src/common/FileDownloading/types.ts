import { AlgorithmType } from "../../common/AlgorithmType";

export enum DownloadType {
  ToSolve = "toSolve",
  Solved = "solved",
}

export enum DownloadFormat {
  word = "docx",
  pdf = "pdf",
  excel = "xlsx",
}

export interface InputData {
  name: string;
  description: string;
  algorithmType: AlgorithmType;
  arrivalTimes: string;
  burstTimes: string;
  timeQuantum: string;
  priorities: string;
  pageRequests: string;
  frames: number;
  resources: number;
  processes: number;
  os: string;
}

export interface MatrixData {
  correctMatrix: (string | number | boolean | null)[][];
  userMatrix: (string | number)[][];
}

export interface SchedulingMatrixData {
  correctMatrix: (string | null)[][];
  userMatrix: (number | number)[][];
}

export interface PageReplacementMatrixData {
  correctMatrix: (number | null | boolean)[][];
  userMatrix: (number | null | boolean)[][];
  pageFaults: ("f" | "")[];
}
