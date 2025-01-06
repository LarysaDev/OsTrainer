import { Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, WidthType } from "docx";
import { saveAs } from "file-saver";

export const generateWordDocument = (
  examSheetName: string,
  description: string,
  algorithmType: string,
  matrixData: { correctMatrix: (number | null)[][]; userMatrix: (string | number)[][] }
) => {
  const { correctMatrix, userMatrix } = matrixData;

  const sanitizedCorrectMatrix = correctMatrix.map((row) =>
    row.map((cell) => (cell === null ? "" : cell))
  );

  const createTableRows = (matrix: (string | number)[][]) =>
    matrix.map((row) =>
      new TableRow({
        children: row.map((cell) =>
          new TableCell({
            children: [new Paragraph(cell.toString())],
          })
        ),
      })
    );

  const correctMatrixTable = new Table({
    rows: createTableRows(sanitizedCorrectMatrix),
    width: { size: 100, type: WidthType.PERCENTAGE },
  });

  const userMatrixTable = new Table({
    rows: createTableRows(userMatrix),
    width: { size: 100, type: WidthType.PERCENTAGE },
  });

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            children: [new TextRun({ text: examSheetName, bold: true, size: 28 })],
            heading: "Heading1",
          }),
          new Paragraph({
            children: [new TextRun({ text: `Description: ${description}`, size: 24 })],
          }),
          new Paragraph({
            children: [new TextRun({ text: `Algorithm Type: ${algorithmType}`, size: 24 })],
          }),
          new Paragraph({
            children: [new TextRun({ text: "Correct Matrix", bold: true, size: 26 })],
            spacing: { before: 300, after: 100 },
          }),
          correctMatrixTable,
          new Paragraph({
            children: [new TextRun({ text: "User Matrix", bold: true, size: 26 })],
            spacing: { before: 300, after: 100 },
          }),
          userMatrixTable,
        ],
      },
    ],
  });

  Packer.toBlob(doc).then((blob) => {
    saveAs(blob, `${examSheetName}.docx`);
  });
};
