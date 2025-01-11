import { PageReplacementMatrixData } from "../../FileDownloading/types";

export const generateFIFOMatrixes = (
  pageRequests: number[],
  frameCount: number
): PageReplacementMatrixData => {
  const { matrix: correctFrameMatrix, pageFaults } = generateMatrix(
    pageRequests,
    frameCount
  );

  console.log("after generation: ", correctFrameMatrix);
  const userMatrix = Array.from({ length: frameCount + 1 }, () =>
    new Array(pageRequests.length).fill(null)
  );

  const correctMatrix = [
    ...correctFrameMatrix,
    pageFaults.map((fault) => (fault ? 1 : 0)),
  ];

  return {
    correctMatrix,
    userMatrix,
  };
};

const generateMatrix = (pageRequests: number[], frameCount: number) => {
  console.log("pageRequests", pageRequests);
  console.log("frames", frameCount);
  const matrix = Array.from({ length: frameCount }, () =>
    new Array(pageRequests.length).fill(null)
  );
  const pageFaults: boolean[] = [];

  // Додамо змінну для відстеження позиції наступної заміни
  let replacePosition = 0;

  pageRequests.forEach((page, columnIndex) => {
    // Отримуємо поточний стан фреймів з попередньої колонки
    const currentFrames =
      columnIndex === 0
        ? Array(frameCount).fill(null)
        : matrix.map((row) => row[columnIndex - 1]);

    // Перевіряємо, чи є сторінка вже у фреймах
    const isPagePresent = currentFrames.includes(page);

    if (!isPagePresent) {
      pageFaults.push(true);

      // Знаходимо перший null
      const nullIndex = currentFrames.indexOf(null);

      if (nullIndex !== -1) {
        // Якщо є вільний фрейм, копіюємо попередній стан
        for (let i = 0; i < frameCount; i++) {
          matrix[i][columnIndex] = currentFrames[i];
        }
        // І додаємо нову сторінку у вільний фрейм
        matrix[nullIndex][columnIndex] = page;
      } else {
        // Якщо вільних фреймів немає, копіюємо попередній стан
        for (let i = 0; i < frameCount; i++) {
          matrix[i][columnIndex] = currentFrames[i];
        }
        // Замінюємо сторінку в поточній позиції заміни
        matrix[replacePosition][columnIndex] = page;
        // Оновлюємо позицію для наступної заміни
        replacePosition = (replacePosition + 1) % frameCount;
      }
    } else {
      // Якщо сторінка вже є, просто копіюємо попередній стан
      pageFaults.push(false);
      for (let i = 0; i < frameCount; i++) {
        matrix[i][columnIndex] = currentFrames[i];
      }
    }
  });
  console.log(matrix);
  return { matrix, pageFaults };
};
