import { TDocumentDefinitions } from "pdfmake/interfaces";
import { DownloadType } from "../types";
import { MatrixData } from "../types";

declare global {
  interface Window {
    pdfMake: any;
  }
}

const loadPdfMakeScripts = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.pdfMake) {
      resolve();
      return;
    }

    const pdfMakeScript = document.createElement('script');
    pdfMakeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/pdfmake.min.js';
    pdfMakeScript.onload = () => {
      const pdfFontsScript = document.createElement('script');
      pdfFontsScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/vfs_fonts.js';
      pdfFontsScript.onload = () => resolve();
      pdfFontsScript.onerror = () => reject(new Error('Failed to load vfs_fonts.js'));
      document.head.appendChild(pdfFontsScript);
    };
    pdfMakeScript.onerror = () => reject(new Error('Failed to load pdfmake.min.js'));
    document.head.appendChild(pdfMakeScript);
  });
};

export const generateSchedulingPdf = async (
  examSheetName: string,
  description: string,
  algorithmType: string,
  downloadType: DownloadType,
  matrixData: MatrixData
): Promise<void> => {
  try {
    await loadPdfMakeScripts();
    
    const { correctMatrix, userMatrix } = matrixData;

    const sanitizedCorrectMatrix = correctMatrix.map((row) =>
      row.map((cell) => (cell === null ? "" : cell))
    );

    const downloadSolvedTable = downloadType === DownloadType.Solved;
    const matrixToUse = downloadSolvedTable ? sanitizedCorrectMatrix : userMatrix;
    const tableHeader = downloadSolvedTable
      ? "Таблиця результатів"
      : "Заповніть матрицю станів процесів";

    const columnsCount = matrixToUse[0].length;
    const rowsCount = matrixToUse.length;
    
    const pageWidth = 595;
    const margin = 40;
    const availableWidth = pageWidth - 2 * margin;
    
    const minColumnWidth = 10;
    const maxColumnsPerPage = 15;
    
    const needSplitting = columnsCount > maxColumnsPerPage;
    
    let fontSize;
    if (needSplitting) {
      fontSize = 7;
    } else if (columnsCount > 15) {
      fontSize = 5;
    } else if (columnsCount > 12) {
      fontSize = 6;
    } else if (columnsCount > 9) {
      fontSize = 7;
    } else if (columnsCount > 6) {
      fontSize = 8;
    } else {
      fontSize = 9;
    }
    
    const content: any[] = [
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
      }
    ];
    
    if (needSplitting) {
      // Розбиваємо таблицю на частини
      const partsCount = Math.ceil(columnsCount / 15);
      const allTableParts = [];
      
      for (let part = 0; part < partsCount; part++) {
        const startCol = part * 15;
        const endCol = Math.min((part + 1) * 15, columnsCount);
      
        const partBody = matrixToUse.map((row, rowIndex) => {
          const rowPart = row.slice(startCol, endCol).map(cell => ({
            text: String(cell),
            alignment: "center",
            fontSize: fontSize
          }));
      
          if (startCol > 0) {
            rowPart.unshift({
              text: rowIndex.toString(),
              alignment: "center",
              fontSize: fontSize,
            });
          }
      
          return rowPart;
        });
        
        // Обчислюємо ширини колонок для поточної частини
        const partColumnWidths = Array(endCol - startCol).fill("*");
        if (startCol > 0) partColumnWidths.unshift("*");
        
        // Додаємо таблицю для поточної частини
        allTableParts.push({
          table: {
            headerRows: 0,
            widths: partColumnWidths,
            body: partBody
          },
          layout: {
            hLineWidth: () => 1,
            vLineWidth: () => 1,
            hLineColor: () => "#000",
            vLineColor: () => "#000",
            paddingLeft: () => 1,
            paddingRight: () => 1,
            paddingTop: () => 1,
            paddingBottom: () => 1,
          },
          margin: [0, part === 0 ? 0 : 10, 0, 10] // Мінімальний відступ між частинами
        });
      }
      
      content.push(...allTableParts);
  
    }

    const docDefinition: TDocumentDefinitions = {
      pageSize: 'A4',
      pageOrientation: 'portrait',
      pageMargins: [margin, 60, margin, 60],
      content: content,
      defaultStyle: {
        font: "Roboto",
      },
    };
    
    console.log('file preparation is over');

    window.pdfMake.createPdf(docDefinition).download(`${examSheetName}.pdf`);
    console.log("PDF generation started");
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Помилка при створенні PDF: " + (error as Error).message);
  }
};