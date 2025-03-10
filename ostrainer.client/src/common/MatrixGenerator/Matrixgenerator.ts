import { AlgorithmType } from "../AlgorithmType";
import {
  PageReplacementMatrixData,
  SchedulingMatrixData,
} from "../FileDownloading/types";
import { getMatrixGenerationLogic } from "./getMatrixGenerationLogic";

export const generateSchedulingMatrixData = (
  arrivalTimes: string,
  burstTimes: string,
  priorities: string,
  timeQuantum: number | null,
  type: AlgorithmType,
  os: string
) => {
  const arrivalArray = arrivalTimes.replace(/\s+/g, "").split(",").map(Number);
  const burstArray = burstTimes.replace(/\s+/g, "").split(",").map(Number);
  const priorityArray = priorities.replace(/\s+/g, "").split(",").map(Number);

  const processList = arrivalArray.map((arrival, index) => ({
    id: index + 1,
    arrivalTime: arrival,
    burstTime: burstArray[index],
    priority: priorityArray[index],
  }));

  const matrixes: SchedulingMatrixData = getMatrixGenerationLogic(type, processList, timeQuantum ?? 0, os);
  
  const maxTime = matrixes.correctMatrix[0].length;
  const minArrivalTime = Math.min(...processList.map(p => p.arrivalTime));

  const processedCount = processList.length;

  const timeUnits = Array.from(
    { length: maxTime },
    (_, i) => i + minArrivalTime
  );

  console.log(matrixes);

  const userMatrixTemplate: (string | number)[][] = [
    ["Process\\Time", ...timeUnits], 
    ...Array.from({ length: processedCount }, (_, index) => [
      `P${index + 1}`,
      ...Array.from({ length: maxTime }, () => ""), 
    ]),
  ];
  const updatedCorrectMatrix = [
    ["ProcessTime", ...timeUnits],
    ...Array.from({ length: processedCount }, (_, processIndex) => [
      `P${processIndex + 1}`,
      ...timeUnits.map(
        (_, requestIndex) =>
          matrixes.correctMatrix[processIndex][requestIndex] ?? null
      ),
    ]),
  ];

  return {
    correctMatrix: updatedCorrectMatrix,
    userMatrix: userMatrixTemplate,
  };
};

export const generatePageReplacementMatrixData = (
  pageRequestsArray: string,
  frameSize: number,
  algType: AlgorithmType
) => {
  const pageRequests = pageRequestsArray
    .replace(/\s+/g, "")
    .split(",")
    .map(Number);
  const matrixes: PageReplacementMatrixData = getMatrixGenerationLogic(
    algType,
    null,
    0,
    pageRequests,
    frameSize,
    null
  );
  const pageFaults = matrixes.pageFaults;

  const userMatrixTemplate: (string | number)[][] = [
    ["Page Requests", ...pageRequests],
    ...Array.from({ length: frameSize }, (_, index) => [
      `frame ${index + 1}`,
      ...Array.from({ length: pageRequests.length }, () => ""),
    ]),
    ["Page Fault?", ...Array.from({ length: pageFaults.length }, () => "")],
  ];
  const updatedCorrectMatrix = [
    ["Page Requests", ...pageRequests],
    ...Array.from({ length: frameSize }, (_, frameIndex) => [
      `frame ${frameIndex + 1}`,
      ...pageRequests.map(
        (_, requestIndex) =>
          matrixes.correctMatrix[frameIndex][requestIndex] ?? null
      ),
    ]),
    ["Page Fault?", ...pageFaults],
  ];
  return {
    correctMatrix: updatedCorrectMatrix,
    userMatrix: userMatrixTemplate,
  };
};
