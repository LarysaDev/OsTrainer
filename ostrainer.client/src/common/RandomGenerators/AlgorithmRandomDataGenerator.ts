export function generateRandomData(processCount: number = 5, maxArrivalTime: number = 10, maxBurstTime: number = 10): [number[], number[]] {
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

export function generateRoundRobinData(processCount: number = 5, maxArrivalTime: number = 10, maxBurstTime: number = 10): [number[], number[], number] {
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

export function generatePrioritySchedulingData(processCount: number = 5, maxArrivalTime: number = 10, maxBurstTime: number = 10, maxPriority: number = 6): [number[], number[], number[]] {
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