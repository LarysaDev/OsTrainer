import { PageReplacementMatrixData } from "../../FileDownloading/types";

export const generateLRUMatrixes = (
  pageRequests: number[],
  frameCount: number,
  useStack: boolean
): PageReplacementMatrixData => {
  const { matrix: correctFrameMatrix, pageFaults } = useStack
    ? generateLRUStackMatrix(pageRequests, Number(frameCount))
    : generateLRUMatrix(pageRequests, Number(frameCount));

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

const generateLRUMatrix = (pageRequests: number[], frameCount: number) => {
  const matrix = Array.from({ length: frameCount }, () =>
    new Array(pageRequests.length).fill(null)
  );
  const frames: number[] = [];
  const pageFaults: boolean[] = [];
  const lastUsed = new Map();

  pageRequests.forEach((page, columnIndex) => {
    lastUsed.set(page, columnIndex);

    const isPagePresent = frames.includes(page);

    if (!isPagePresent) {
      pageFaults.push(true);

      if (frames.length < frameCount) {
        frames.push(page);
      } else {
        let leastRecentlyUsed = frames[0];
        let lruIndex = lastUsed.get(frames[0]);

        for (const frame of frames) {
          if (lastUsed.get(frame) < lruIndex) {
            leastRecentlyUsed = frame;
            lruIndex = lastUsed.get(frame);
          }
        }

        const replaceIndex = frames.indexOf(leastRecentlyUsed);
        frames[replaceIndex] = page;
      }
    } else {
      pageFaults.push(false);
    }

    for (let i = 0; i < frameCount; i++) {
      matrix[i][columnIndex] = frames[i] ?? null;
    }
  });

  return { matrix, pageFaults };
};

const generateLRUStackMatrix = (pageRequests: number[], frameCount: number) => {
  const matrix = Array.from({ length: frameCount }, () =>
    new Array(pageRequests.length).fill(null)
  );
  const frames: number[] = [];
  const pageFaults: boolean[] = [];

  pageRequests.forEach((page, columnIndex) => {
    const pageIndex = frames.indexOf(page);

    if (pageIndex === -1) {
      pageFaults.push(true);

      if (frames.length < frameCount) {
        frames.unshift(page);
      } else {
        frames.pop();
        frames.unshift(page);
      }
    } else {
      pageFaults.push(false);
      frames.splice(pageIndex, 1);
      frames.unshift(page);
    }

    for (let i = 0; i < frameCount; i++) {
      matrix[i][columnIndex] = frames[i] ?? null;
    }
  });

  return { matrix, pageFaults };
};
