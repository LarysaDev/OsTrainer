export const generateSchedulingMatrixData = (
  pageRequests: number[],
  frameSize: number,
  generateMatrixLogic: (
    requests: number[],
    frameCount: number
  ) => { matrix: (number | null)[][]; pageFaults: boolean[] }
) => {
  const { matrix: correctFrameMatrix, pageFaults } = generateMatrixLogic(
    pageRequests,
    frameSize
  );

  const userMatrixTemplate: (string | number)[][] = [
    ["Page Requests", ...pageRequests],
    ...Array.from({ length: frameSize }, (_, index) => [
      `frame ${index + 1}`,
      ...Array.from({ length: pageRequests.length }, () => ""),
    ]),
    ["Page Fault?", ...Array.from({ length: pageRequests.length }, () => "")],
  ];

  const updatedCorrectMatrix = [
    ["Page Requests", ...pageRequests],
    ...Array.from({ length: frameSize }, (_, frameIndex) => [
      `frame ${frameIndex + 1}`,
      ...pageRequests.map((_, requestIndex) => correctFrameMatrix[frameIndex][requestIndex] ?? null),
    ]),
    ["Page Fault?", ...pageFaults],
  ];

  return {
    correctMatrix: updatedCorrectMatrix,
    pageFaults,
    userMatrix: userMatrixTemplate,
  };
};

export const generateFIFOMatrix = (
  pageRequests: number[],
  frameCount: number
) => {
  const matrix = Array.from({ length: frameCount }, () =>
    new Array(pageRequests.length).fill(null)
  );
  const frames: number[] = [];
  const pageFaults: boolean[] = [];

  pageRequests.forEach((page, columnIndex) => {
    const isPagePresent = frames.includes(page);

    if (!isPagePresent) {
      pageFaults.push(true);

      if (frames.length < frameCount) {
        frames.unshift(page);
      } else {
        frames.pop();
        frames.unshift(page);
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

