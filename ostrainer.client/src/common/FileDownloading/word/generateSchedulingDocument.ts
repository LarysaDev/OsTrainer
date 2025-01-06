import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx";
import { DownloadType } from "../types";
import { saveAs } from "file-saver";

export const generateSchedulingDocument = (
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

  const createTableRows = (matrix: (string | number)[][]) =>
    matrix.map(
      (row) =>
        new TableRow({
          children: row.map(
            (cell) =>
              new TableCell({
                children: [new Paragraph(cell.toString())],
              })
          ),
        })
    );

  const downloadSolvedTable = downloadType == DownloadType.Solved;
  let userSelectedMatrix: Table = downloadSolvedTable
    ? new Table({
        rows: createTableRows(sanitizedCorrectMatrix),
        width: { size: 100, type: WidthType.PERCENTAGE },
      })
    : new Table({
        rows: createTableRows(userMatrix),
        width: { size: 100, type: WidthType.PERCENTAGE },
      });

  const tableHeader = downloadSolvedTable
    ? "Таблиця результатів"
    : "Заповніть матрицю станів процесів";

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            children: [
              new TextRun({ text: examSheetName, bold: true, size: 28 }),
            ],
            heading: "Heading1",
          }),
          new Paragraph({
            children: [new TextRun({ text: description, size: 24 })],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Алгоритм для опрацювання: ${algorithmType}`,
                size: 24,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Стани процесів', bold: true, size: 22 }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "-: Виконання не розпочалось, e: Виконується, w: Очікує",
                size: 22,
              }),
            ],
            spacing: { before: 300, after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: tableHeader, bold: true, size: 26 }),
            ],
            spacing: { before: 300, after: 100 },
          }),
          userSelectedMatrix,
        ],
      },
    ],
  });

  Packer.toBlob(doc).then((blob) => {
    saveAs(blob, `${examSheetName}.docx`);
  });
};
