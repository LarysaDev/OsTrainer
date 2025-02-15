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
import { DownloadType, InputData, MatrixData } from "../types";
import { saveAs } from "file-saver";
import { AlgorithmType, isSchedulingType } from "../../AlgorithmType";

export const generateWordDocument = (
  inputData: InputData,
  downloadType: DownloadType,
  matrixData: MatrixData
) => {
  const { correctMatrix, userMatrix } = matrixData;

  console.log(matrixData);

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
    : "Заповніть матрицю";
  console.log("ready...");

  const inputDataParagraphs = isSchedulingType(inputData.algorithmType)
    ? [
        new Paragraph({
          children: [
            new TextRun({
              text: `Час прибуття: ${inputData.arrivalTimes}`,
              size: 22,
            }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Час виконання: ${inputData.burstTimes}`,
              size: 22,
            }),
          ],
        }),
        inputData.priorities
          ? new Paragraph({
              children: [
                new TextRun({
                  text: `Пріоритети: ${inputData.priorities}`,
                  size: 22,
                }),
              ],
            })
          : null,
          inputData.os
          ? new Paragraph({
              children: [
                new TextRun({
                  text: `Операційна система: ${inputData.os}`,
                  size: 22,
                }),
              ],
            })
          : null,
      ]
    : [
        new Paragraph({
          children: [
            new TextRun({
              text: `Запити сторінок: ${inputData.pageRequests}`,
              size: 22,
            }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Кількість кадрів: ${inputData.frames}`,
              size: 22,
            }),
          ],
        }),
      ];

  const processStatesParagraphs = isSchedulingType(inputData.algorithmType)
    ? [
        new Paragraph({
          children: [
            new TextRun({ text: "Стани процесів", bold: true, size: 22 }),
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
      ]
    : [];

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            children: [
              new TextRun({ text: inputData.name, bold: true, size: 28 }),
            ],
            heading: "Heading1",
          }),
          new Paragraph({
            children: [new TextRun({ text: inputData.description, size: 24 })],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Алгоритм для опрацювання: ${inputData.algorithmType}`,
                size: 24,
              }),
            ],
          }),
          ...inputDataParagraphs, 
          ...processStatesParagraphs,
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
    saveAs(blob, `${inputData.name}.docx`);
  });
};
