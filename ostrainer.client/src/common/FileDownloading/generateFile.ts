import { DownloadType, DownloadFormat, MatrixData } from "./types";
import {
  isSchedulingType,
  isReplacingType,
  isDeadlockAvoiding,
  AlgorithmType,
} from "../AlgorithmType";
import { generateSchedulingDocument } from "./word/generateSchedulingDocument";
import { generateSchedulingPdf } from "./pdf/generateSchedulingPdf";
import { generateSchedulingExcel } from "./excel/generateSchedulingExcel";

export const generateFile = (
  examSheetName: string,
  description: string,
  algorithmType: AlgorithmType,
  downloadType: DownloadType,
  downloadFormat: DownloadFormat,
  matrixData: MatrixData
) => {
    console.log('generating...')
  switch (downloadFormat) {
    case DownloadFormat.word:
      return generateWordFile(examSheetName, description, algorithmType, downloadType, matrixData);
      break;
    case DownloadFormat.pdf:
      return generatePdfFile(examSheetName, description, algorithmType, downloadType, matrixData);
      break;
    case DownloadFormat.excel:
      return generateExcelFile(examSheetName, description, algorithmType, downloadType, matrixData);
      break;
    default:
      console.error("Не підтримуваний формат.");
  }
};

const generateWordFile = (
  examSheetName: string,
  description: string,
  algorithmType: AlgorithmType,
  downloadType: DownloadType,
  matrixData: MatrixData
) => {
    if(isSchedulingType(algorithmType)){
        return generateSchedulingDocument(examSheetName, description, algorithmType, downloadType, matrixData);
    }
};

const generatePdfFile = (
    examSheetName: string,
    description: string,
    algorithmType: AlgorithmType,
    downloadType: DownloadType,
    matrixData: MatrixData
  ) => {
    if(isSchedulingType(algorithmType)){
        return generateSchedulingPdf(examSheetName, description, algorithmType, downloadType, matrixData);
    }
  };

  const generateExcelFile = (
    examSheetName: string,
    description: string,
    algorithmType: AlgorithmType,
    downloadType: DownloadType,
    matrixData: MatrixData
  ) => {
    if(isSchedulingType(algorithmType)){
        return generateSchedulingExcel(examSheetName, description, algorithmType, downloadType, matrixData);
    }
  };
  
  