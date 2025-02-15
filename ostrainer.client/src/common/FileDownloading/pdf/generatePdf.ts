import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { TDocumentDefinitions } from "pdfmake/interfaces";
import { DownloadType, InputData } from "../types";
import { MatrixData } from "../types";

export const generatePdf = (
  inputData: InputData,
  downloadType: DownloadType,
  matrixData: MatrixData
) => {
  const { correctMatrix, userMatrix } = matrixData;

  // Очистка значень у матриці
  const sanitizedCorrectMatrix = correctMatrix.map((row) =>
    row.map((cell) => (cell === null ? "" : cell))
  );

  const downloadSolvedTable = downloadType === DownloadType.Solved;
  const matrixToUse = downloadSolvedTable ? sanitizedCorrectMatrix : userMatrix;
  const tableHeader = downloadSolvedTable
    ? "Таблиця результатів"
    : "Заповніть матрицю станів процесів";

  // Формування таблиці для PDF
  const tableBody = matrixToUse.map((row) =>
    row.map((cell) => ({
      text: String(cell),
      alignment: "center",
      fontSize: 9,
    }))
  );

  // Формуємо блоки введення
  const inputDataBlocks = [
    {
      text: `Час прибуття: ${inputData.arrivalTimes}`,
      fontSize: 12,
      margin: [0, 0, 0, 5],
    },
    {
      text: `Час виконання: ${inputData.burstTimes}`,
      fontSize: 12,
      margin: [0, 0, 0, 5],
    },
  ];

  // Додаємо пріоритети, якщо є
  if (inputData.priorities) {
    inputDataBlocks.push({
      text: `Пріоритети: ${inputData.priorities}`,
      fontSize: 12,
      margin: [0, 0, 0, 5],
    });
  }

  // Додаємо інформацію про операційну систему, якщо є
  if (inputData.os) {
    inputDataBlocks.push({
      text: `Операційна система: ${inputData.os}`,
      fontSize: 12,
      margin: [0, 0, 0, 5],
    });
  }

  // Стани процесів
  const processStatesParagraphs = [
    {
      text: "Стани процесів",
      fontSize: 12,
      bold: true,
      margin: [0, 0, 0, 5],
    },
    {
      text: "-: Виконання не розпочалось, e: Виконується, w: Очікує",
      fontSize: 12,
      margin: [0, 0, 0, 15],
    },
  ];

  // Створення PDF
  const docDefinition: TDocumentDefinitions = {
    content: [
      {
        text: inputData.name,
        fontSize: 20,
        bold: true,
        margin: [0, 0, 0, 15],
      },
      {
        text: inputData.description,
        fontSize: 10,
        margin: [0, 0, 0, 15],
      },
      {
        text: `Алгоритм для опрацювання: ${inputData.algorithmType}`,
        fontSize: 14,
        margin: [0, 0, 0, 15],
      },
      ...inputDataBlocks,
      ...processStatesParagraphs,
      {
        text: tableHeader,
        fontSize: 9,
        bold: true,
        margin: [0, 20, 0, 15],
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
    ]
  };

  pdfMake.createPdf(docDefinition).download(`${inputData.name}.pdf`);
};
