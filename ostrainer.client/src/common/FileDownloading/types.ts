export enum DownloadType {
  ToSolve = "toSolve",
  Solved = "solved",
}

export enum DownloadFormat {
  word = "docx",
  pdf = "pdf",
  excel = "excel",
}

export interface MatrixData {
  correctMatrix: (number | null)[][];
  userMatrix: (string | number)[][];
}

export interface SchedulingMatrixData {
  correctMatrix: (string | null)[][];
  userMatrix: (number | number)[][];
}

export interface PageReplacementMatrixData {
  correctMatrix: (number | null | boolean)[][];
  userMatrix: (number | null | boolean)[][];
  pageFaults: ('f' | '')[]
}