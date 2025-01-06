import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable'
import { DownloadType } from "../types";

interface MatrixData {
  correctMatrix: (number | null)[][];
  userMatrix: (string | number)[][];
}

export const generateSchedulingPdf = (
    examSheetName: string,
    description: string,
    algorithmType: string,
    downloadType: DownloadType,
    matrixData: MatrixData
  ) => {
    const { correctMatrix, userMatrix } = matrixData;
  
    const sanitizedCorrectMatrix = correctMatrix.map((row) =>
      row.map((cell) => (cell === null ? "" : cell))
    );
  
    const createTableRows = (matrix: (string | number)[][]) =>
      matrix.map((row) => row.map((cell) => String(cell)));
  
    const downloadSolvedTable = downloadType === DownloadType.Solved;
    const matrixToUse = downloadSolvedTable ? sanitizedCorrectMatrix : userMatrix;
  
    const tableHeader = downloadSolvedTable
      ? "Таблиця результатів"
      : "Заповніть матрицю станів процесів";
  
    const doc = new jsPDF();
  
    doc.setFontSize(28);
    doc.text(examSheetName, 20, 20);
  
    doc.setFontSize(24);
    doc.text(description, 20, 30);
  
    doc.setFontSize(24);
    doc.text(`Алгоритм для опрацювання: ${algorithmType}`, 20, 40);
  
    doc.setFontSize(22);
    doc.text("Стани процесів", 20, 50);
    doc.setFontSize(22);
    doc.text("-: Виконання не розпочалось, e: Виконується, w: Очікує", 20, 60);
  
    doc.setFontSize(26);
    doc.text(tableHeader, 20, 70);
  
    const rows = createTableRows(matrixToUse);
    const columnWidths = Array(rows[0].length).fill(30); 
  
    autoTable(doc, {
      startY: 80,
      head: [["Колонка 1", "Колонка 2", "Колонка 3", "Колонка 4"]], 
      body: rows, 
      columnStyles: {
        0: { cellWidth: 40 }, 
      },
      styles: {
        fontSize: 12,
      },
      theme: "grid", 
    });
  
    doc.save(`${examSheetName}.pdf`);
  };