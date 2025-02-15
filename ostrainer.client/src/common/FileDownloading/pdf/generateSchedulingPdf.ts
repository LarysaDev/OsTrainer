import { TDocumentDefinitions } from "pdfmake/interfaces";
import { DownloadType } from "../types";
import { MatrixData } from "../types";

// Оголошуємо типи для глобального об'єкта window
declare global {
  interface Window {
    pdfMake: any;
  }
}

// Функція для завантаження скриптів pdfMake
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
    // Завантажуємо pdfMake скрипти
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

    // Визначаємо кількість колонок та рядків
    const columnsCount = matrixToUse[0].length;
    const rowsCount = matrixToUse.length;
    
    // A4 в портретній орієнтації: 595x842 точок (ширина x висота)
    const pageWidth = 595;
    const margin = 40;
    const availableWidth = pageWidth - 2 * margin;
    
    // Визначаємо максимальну кількість колонок, яка може поміститися на сторінці
    const minColumnWidth = 15; // Мінімальна ширина колонки в точках
    const maxColumnsPerPage = Math.floor(availableWidth / minColumnWidth);
    
    // Визначаємо, чи потрібно розбивати таблицю
    const needSplitting = columnsCount > maxColumnsPerPage;
    
    // Адаптивний розмір шрифту базується на кількості колонок
    let fontSize;
    if (needSplitting) {
      fontSize = 7; // Якщо таблиця розбивається, можемо використовувати більший шрифт
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
    
    // Підготовка контенту документа
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
      const partsCount = Math.ceil(columnsCount / maxColumnsPerPage);
      
      for (let part = 0; part < partsCount; part++) {
        const startCol = part * maxColumnsPerPage;
        const endCol = Math.min((part + 1) * maxColumnsPerPage, columnsCount);
        const partColumnsCount = endCol - startCol;
        
        // Додаємо заголовок для кожної частини таблиці
        content.push({
          text: `${tableHeader} (Частина ${part + 1} з ${partsCount})`,
          fontSize: 9,
          bold: true,
          margin: [0, 20, 0, 15]
        });
        
        // Створюємо підмасив даних для поточної частини
        const partBody = matrixToUse.map(row => {
          // Створюємо підмасив комірок для поточної частини рядка
          const rowPart = row.slice(startCol, endCol).map(cell => ({
            text: String(cell),
            alignment: "center",
            fontSize: fontSize
          }));
          
          // Додаємо першу колонку з індексом рядка для кожної частини, крім першої
          if (part > 0) {
            // Знаходимо першу комірку першого рядка для отримання назви
            rowPart.unshift({
              text: row[0].toString(),
              alignment: "center",
              fontSize: fontSize
            });
          }
          
          return rowPart;
        });
        
        // Обчислюємо ширини колонок для поточної частини
        const partColumnWidths = Array(partColumnsCount).fill("*");
        if (part > 0) {
          // Додаємо ширину для колонки з індексом рядка
          partColumnWidths.unshift("*");
        }
        
        // Додаємо таблицю для поточної частини
        content.push({
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
          margin: [0, 0, 0, 20]
        });
      }
    } else {
      // Якщо розбивати не потрібно, додаємо повну таблицю
      content.push({
        text: tableHeader,
        fontSize: 9,
        bold: true,
        margin: [0, 20, 0, 15]
      });
      
      // Створюємо масив з фіксованими ширинами для кожної колонки
      const columnWidth = Math.floor(availableWidth / columnsCount);
      const columnWidths = Array(columnsCount).fill(columnWidth);
      
      // Підготовка даних таблиці з форматуванням
      const tableBody = matrixToUse.map((row) =>
        row.map((cell) => ({
          text: String(cell),
          alignment: "center",
          fontSize: fontSize
        }))
      );
      
      content.push({
        table: {
          headerRows: 0,
          widths: columnWidths,
          body: tableBody,
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
      });
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