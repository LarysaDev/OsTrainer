// Стандартний LRU
const generateLRUMatrix = (pageRequests, frameCount) => {
    const matrix = Array.from({ length: frameCount }, () => 
      new Array(pageRequests.length).fill(null)
    );
    const frames = [];
    const pageFaults = [];
    const lastUsed = new Map(); // Відслідковування останнього використання
  
    pageRequests.forEach((page, columnIndex) => {
      // Оновлюємо час останнього використання для поточної сторінки
      lastUsed.set(page, columnIndex);
      
      const isPagePresent = frames.includes(page);
  
      if (!isPagePresent) {
        pageFaults.push(true);
  
        if (frames.length < frameCount) {
          frames.push(page);
        } else {
          // Знаходимо сторінку, яка не використовувалась найдовше
          let leastRecentlyUsed = frames[0];
          let lruIndex = lastUsed.get(frames[0]);
  
          for (const frame of frames) {
            if (lastUsed.get(frame) < lruIndex) {
              leastRecentlyUsed = frame;
              lruIndex = lastUsed.get(frame);
            }
          }
  
          // Замінюємо найдавніше використану сторінку
          const replaceIndex = frames.indexOf(leastRecentlyUsed);
          frames[replaceIndex] = page;
        }
      } else {
        pageFaults.push(false);
      }
  
      // Заповнюємо матрицю поточним станом фреймів
      for (let i = 0; i < frameCount; i++) {
        matrix[i][columnIndex] = frames[i] ?? null;
      }
    });
  
    return { matrix, pageFaults };
  };
  
  // LRU Stack варіант
  const generateLRUStackMatrix = (pageRequests, frameCount) => {
    const matrix = Array.from({ length: frameCount }, () => 
      new Array(pageRequests.length).fill(null)
    );
    const frames = [];
    const pageFaults = [];
  
    pageRequests.forEach((page, columnIndex) => {
      const pageIndex = frames.indexOf(page);
      
      if (pageIndex === -1) {
        pageFaults.push(true);
  
        if (frames.length < frameCount) {
          // Якщо є вільні фрейми, додаємо нову сторінку на початок
          frames.unshift(page);
        } else {
          // Видаляємо найстарішу сторінку (внизу стеку) і додаємо нову на початок
          frames.pop();
          frames.unshift(page);
        }
      } else {
        // Якщо сторінка вже є, переміщуємо її на вершину стеку
        pageFaults.push(false);
        frames.splice(pageIndex, 1);
        frames.unshift(page);
      }
  
      // Заповнюємо матрицю поточним станом фреймів
      for (let i = 0; i < frameCount; i++) {
        matrix[i][columnIndex] = frames[i] ?? null;
      }
    });
  
    return { matrix, pageFaults };
  };
  
  // Приклад використання:
  const pageRequests = [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5];
  const frameCount = 3;
  
  // Тестування стандартного LRU
  const lruResult = generateLRUMatrix(pageRequests, frameCount);
  console.log("Standard LRU Matrix:", lruResult.matrix);
  console.log("Page Faults:", lruResult.pageFaults);
  
  // Тестування LRU Stack
  const lruStackResult = generateLRUStackMatrix(pageRequests, frameCount);
  console.log("LRU Stack Matrix:", lruStackResult.matrix);
  console.log("Page Faults:", lruStackResult.pageFaults);