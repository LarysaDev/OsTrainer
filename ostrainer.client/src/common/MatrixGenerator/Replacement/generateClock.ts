import { PageReplacementMatrixData } from "../../FileDownloading/types";

export const generateClockMatrixes = (
  pageRequests: number[],
  frameCount: number
): PageReplacementMatrixData => {
  const { matrix: correctFrameMatrix, pageFaults } = generateClockMatrix(
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


const generateClockMatrix = (pageRequests: number[], frameCount: number) => {
    const matrix = Array.from({ length: frameCount }, () =>
      new Array(pageRequests.length).fill(null)
    );
    const frames = new Array(frameCount).fill(null);
    const secondChanceBits = new Array(frameCount).fill(0);
    const pageFaults: boolean[] = [];
    let pointer = 0;
  
    pageRequests.forEach((page, columnIndex) => {
      const frameIndex = frames.indexOf(page);
  
      if (frameIndex === -1) {
        pageFaults.push(true);
  
        if (frames.includes(null)) {
          const emptyIndex = frames.indexOf(null);
          frames[emptyIndex] = page;
          secondChanceBits[emptyIndex] = 1;
        } else {
          while (secondChanceBits[pointer] === 1) {
            secondChanceBits[pointer] = 0;
            pointer = (pointer + 1) % frameCount;
          }
          frames[pointer] = page;
          secondChanceBits[pointer] = 1;
          pointer = (pointer + 1) % frameCount;
        }
      } else {
        pageFaults.push(false);
        secondChanceBits[frameIndex] = 1;
      }
  
      for (let i = 0; i < frameCount; i++) {
        matrix[i][columnIndex] = frames[i];
      }
    });
  
    return { matrix, pageFaults };
  };