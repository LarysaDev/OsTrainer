import { PageReplacementMatrixData } from "../../FileDownloading/types";

export const generateMFUMatrixes = (
  pageRequests: number[],
  frameCount: number
): PageReplacementMatrixData => {
  const { matrix: correctFrameMatrix, pageFaults } = generateMFUMatrix(
    pageRequests,
    Number(frameCount)
  );

  const updatedFaults = pageFaults.map((fault) => (fault == true ? "f" : ""));

  const userMatrix = Array.from({ length: frameCount + 1 }, () =>
    new Array(pageRequests.length).fill(null)
  );

  return {
    correctMatrix: correctFrameMatrix,
    userMatrix,
    pageFaults: updatedFaults,
  };
};

const generateMFUMatrix = (pageRequests: number[], frameCount: number) => {
  const matrix = Array.from({ length: frameCount }, () =>
    new Array(pageRequests.length).fill(null)
  );
  const frames: number[] = [];
  const pageFaults: boolean[] = [];
  const counters = new Map();

  pageRequests.forEach((page, columnIndex) => {
    const isPagePresent = frames.includes(page);

    if (!isPagePresent) {
      pageFaults.push(true);

      if (frames.length < frameCount) {
        frames.push(page);
        counters.set(page, 1);
      } else {
        let maxCount = -1;
        let mostFrequent = null;

        for (const frame of frames) {
          if (counters.get(frame) > maxCount) {
            maxCount = counters.get(frame);
            mostFrequent = frame;
          }
        }

        const replaceIndex = frames.indexOf(mostFrequent);
        frames[replaceIndex] = page;
        counters.delete(mostFrequent);
        counters.set(page, 1);
      }
    } else {
      pageFaults.push(false);
      counters.set(page, counters.get(page) + 1);
    }

    for (let i = 0; i < frameCount; i++) {
      matrix[i][columnIndex] = frames[i] ?? null;
    }
  });

  return { matrix, pageFaults };
};
