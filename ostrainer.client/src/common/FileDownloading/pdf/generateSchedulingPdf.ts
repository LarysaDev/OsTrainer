import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { TDocumentDefinitions } from "pdfmake/interfaces";
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

  const downloadSolvedTable = downloadType === DownloadType.Solved;
  const matrixToUse = downloadSolvedTable ? sanitizedCorrectMatrix : userMatrix;
  const tableHeader = downloadSolvedTable
    ? "Таблиця результатів"
    : "Заповніть матрицю станів процесів";

  const tableBody = matrixToUse.map((row) =>
    row.map((cell) => ({
      text: String(cell),
      alignment: "center",
      fontSize: 9
    }))
  );

  const docDefinition: TDocumentDefinitions = {
    content: [
      {
        text: examSheetName,
        fontSize: 20,
        bold: true,
        margin: [0, 0, 0, 15]
      },
      {
        text: description,
        fontSize: 10,
        margin: [0, 0, 0, 15]
      },
      {
        text: `Алгоритм для опрацювання: ${algorithmType}`,
        fontSize: 14,
        margin: [0, 0, 0, 15]
      },
      {
        text: "Стани процесів",
        fontSize: 10,
        bold: true,
        margin: [0, 0, 0, 5]
      },
      {
        text: "-: Виконання не розпочалось, e: Виконується, w: Очікує",
        fontSize: 10,
        margin: [0, 0, 0, 20]
      },
      {
        text: tableHeader,
        fontSize: 9,
        bold: true,
        margin: [0, 20, 0, 15]
      },
      {
        table: {
          headerRows: 0,
          widths: Array(matrixToUse[0].length).fill("*"),
          body: tableBody,
        },
        layout: {
          hLineWidth: () => 1,
          vLineWidth: () => 1,
          hLineColor: () => "#000",
          vLineColor: () => "#000",
          paddingLeft: () => 2,
          paddingRight: () => 2,
          paddingTop: () => 2,
          paddingBottom: () => 2,
        },
      },
    ],
    defaultStyle: {
      font: "Roboto",
    },
  };

  // Configure fonts
  (pdfMake as any).vfs = pdfFonts.vfs;

  // Generate and download PDF
  pdfMake.createPdf(docDefinition).download(`${examSheetName}.pdf`);
};