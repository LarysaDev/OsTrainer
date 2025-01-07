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
