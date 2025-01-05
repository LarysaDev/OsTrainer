export function generateRandomData(processCount: number = 4, maxArrivalTime: number = 8, maxBurstTime: number = 8): [number[], number[]] {
    const arrivalTimes: number[] = [];
    const burstTimes: number[] = [];

    for (let i = 0; i < processCount; i++) {
        const arrivalTime = Math.floor(Math.random() * maxArrivalTime);
        const burstTime = Math.floor(Math.random() * (maxBurstTime - 1)) + 1;

        arrivalTimes.push(arrivalTime);
        burstTimes.push(burstTime);
    }

    arrivalTimes.sort((a, b) => a - b);

    return [arrivalTimes, burstTimes];
}

export function generateRoundRobinData(processCount: number = 4, maxArrivalTime: number = 8, maxBurstTime: number = 8): [number[], number[], number] {
    const arrivalTimes: number[] = [];
    const burstTimes: number[] = [];

    for (let i = 0; i < processCount; i++) {
        const arrivalTime = Math.floor(Math.random() * maxArrivalTime);
        const burstTime = Math.floor(Math.random() * (maxBurstTime - 1)) + 1;

        arrivalTimes.push(arrivalTime);
        burstTimes.push(burstTime);
    }

    arrivalTimes.sort((a, b) => a - b);
    const timeQuantum = Math.floor(Math.random() * 4) + 2;

    return [arrivalTimes, burstTimes, timeQuantum];
}

export function generatePrioritySchedulingData(processCount: number = 4, maxArrivalTime: number = 8, maxBurstTime: number = 8, maxPriority: number = 6): [number[], number[], number[]] {
    const arrivalTimes: number[] = [];
    const burstTimes: number[] = [];
    const priorities: number[] = [];

    for (let i = 0; i < processCount; i++) {
        const arrivalTime = Math.floor(Math.random() * maxArrivalTime);
        const burstTime = Math.floor(Math.random() * (maxBurstTime - 1)) + 1;
        const priority = Math.floor(Math.random() * maxPriority);
        arrivalTimes.push(arrivalTime);
        burstTimes.push(burstTime);
        priorities.push(priority);
    }
    arrivalTimes.sort((a, b) => a - b);

    return [arrivalTimes, burstTimes, priorities];
}

export function generatePageReplacementData(): [number[], number] {
    const pageCount = Math.floor(Math.random() * 6) + 10;
    const frameSize = Math.random() < 0.5 ? 3 : 4;

    const pages: number[] = [];
    for (let i = 0; i < pageCount; i++) {
        const page = Math.floor(Math.random() * 10); 
        pages.push(page);
    }

    return [pages, frameSize];
}

export function generateBankerAlgorithmData(): [number, number, number[][], number[][], number[]] {
    const resourceCount = Math.floor(Math.random() * 4) + 3;
    const processCount = Math.floor(Math.random() * 5) + 5;
  
    const maxNeeds: number[][] = [];
    const allocations: number[][] = [];
    const availableResources: number[] = [];
  
    for (let i = 0; i < processCount; i++) {
      const maxRow: number[] = [];
      const allocRow: number[] = [];
      for (let j = 0; j < resourceCount; j++) {
        const maxNeed = Math.floor(Math.random() * 10) + 1;
        const allocation = Math.floor(Math.random() * (maxNeed + 1));
        maxRow.push(maxNeed);
        allocRow.push(allocation);
      }
      maxNeeds.push(maxRow);
      allocations.push(allocRow);
    }
  
    for (let j = 0; j < resourceCount; j++) {
      const totalAllocated = allocations.reduce((sum, row) => sum + row[j], 0);
      const maxAvailable = Math.floor(Math.random() * 10) + totalAllocated;
      availableResources.push(maxAvailable - totalAllocated);
    }
  
    return [
      resourceCount,
      processCount,
      maxNeeds,
      allocations,
      availableResources,
    ];
  }
  