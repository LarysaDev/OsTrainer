import * as XLSX from "xlsx";
import { DownloadType } from "../types";

export const generateSchedulingExcel = (
  examSheetName: string,
  description: string,
  algorithmType: string,
  downloadType: DownloadType,
  matrixData: {
    correctMatrix: (number | null)[][];
    userMatrix: (string | number)[][];
  }
) => {
  const { correctMatrix, userMatrix } = matrixData;

  const sanitizedCorrectMatrix = correctMatrix.map((row) =>
    row.map((cell) => (cell === null ? "" : cell))
  );

  const downloadSolvedTable = downloadType === DownloadType.Solved;
  const selectedMatrix = downloadSolvedTable ? sanitizedCorrectMatrix : userMatrix;

  const tableHeader = downloadSolvedTable
    ? "Таблиця результатів"
    : "Заповніть матрицю станів процесів";

  const wsData: any[] = [
    [examSheetName],
    [description],
    ["Алгоритм для опрацювання", algorithmType],
    ["Стани процесів", "-: Виконання не розпочалось, e: Виконується, w: Очікує"],
    [],
    [tableHeader],
  ];

  wsData.push(...selectedMatrix.map(row => row));

  const ws = XLSX.utils.aoa_to_sheet(wsData);

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Результати");

  const fileName = downloadSolvedTable
    ? `${examSheetName}_Solved.xlsx`
    : `${examSheetName}_ToSolve.xlsx`;

  XLSX.writeFile(wb, fileName);
};
