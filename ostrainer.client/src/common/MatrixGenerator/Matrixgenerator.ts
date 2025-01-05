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

