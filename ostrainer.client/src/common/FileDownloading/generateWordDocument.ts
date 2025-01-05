import { Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, WidthType } from "docx";
import { saveAs } from "file-saver";

export const generateWordDocument = (rows: any[], columns: any[]) => {
  // Формуємо заголовки таблиці
  const tableHeaders = new TableRow({
    children: columns.map((col) => 
      new TableCell({
        children: [
          new Paragraph({
            children: [new TextRun({ text: col.headerName, bold: true })],
          }),
        ],
      })
    ),
  });

  // Формуємо рядки таблиці
  const tableRows = rows.map((row) =>
    new TableRow({
      children: columns.map((col) => 
        new TableCell({
          children: [new Paragraph(row[col.field]?.toString() || "")],
        })
      ),
    })
  );

  // Створюємо таблицю
  const table = new Table({
    rows: [tableHeaders, ...tableRows],
    width: { size: 100, type: WidthType.PERCENTAGE },
  });

  // Створюємо документ
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({ children: [new TextRun("Таблиця з даними")], heading: "Heading1" }),
          table,
        ],
      },
    ],
  });

  // Генеруємо документ і зберігаємо його
  Packer.toBlob(doc).then((blob) => {
    saveAs(blob, "TableDocument.docx");
  });
};
