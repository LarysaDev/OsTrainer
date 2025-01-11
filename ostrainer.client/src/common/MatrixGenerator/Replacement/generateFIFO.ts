import { PageReplacementMatrixData } from "../../FileDownloading/types";

export const generateFIFOMatrixes = (
  pageRequests: number[],
  frameCount: number
): PageReplacementMatrixData => {
  const { matrix: correctFrameMatrix, pageFaults } = generateMatrix(
    pageRequests,
    (Number(frameCount))
  );

  const updatedFaults = pageFaults.map((fault) => (fault == true ? 'f' : ''));

  const userMatrix = Array.from({ length: frameCount + 1 }, () =>
    new Array(pageRequests.length).fill(null)
  );

  return {
    correctMatrix: correctFrameMatrix,
    userMatrix,
    pageFaults: updatedFaults
  };
};

const generateMatrix = (pageRequests: number[], frameCount: number) => {
  const matrix = Array.from({ length: frameCount }, () =>
    new Array(pageRequests.length).fill(null)
  );
  const pageFaults: boolean[] = [];

  let replacePosition = 0;

  pageRequests.forEach((page, columnIndex) => {
    const currentFrames =
      columnIndex === 0
        ? Array(frameCount).fill(null)
        : matrix.map((row) => row[columnIndex - 1]);

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
  return { matrix, pageFaults };
};
