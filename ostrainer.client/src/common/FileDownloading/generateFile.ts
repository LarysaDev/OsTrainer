import { DownloadType, DownloadFormat, MatrixData, InputData } from "./types";
import { isSchedulingType, AlgorithmType } from "../AlgorithmType";
import { generateWordDocument } from "./word/generateDocument";
import { generateSchedulingPdf } from "./pdf/generateSchedulingPdf";
import { generateSchedulingExcel } from "./excel/generateSchedulingExcel";
import { useGenerateFileMutation } from "../../app/fileGenerationApi";

export const generateFile = async (
  inputData: InputData,
  downloadType: DownloadType,
  downloadFormat: DownloadFormat,
  matrixData: MatrixData
) => {
  const [generateFile, { isLoading }] = useGenerateFileMutation();

  console.log("start generation");

  const response = await generateFile({
    fileType: "word",
    dto: {
      request: {
        ...inputData,
      },
      matrixData: matrixData,
    },
  });

  const url = window.URL.createObjectURL(new Blob([response]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `report.pdf`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // console.log("generating...");
  // switch (downloadFormat) {
  //   case DownloadFormat.word:
  //     generateWordDocument(
  //       inputData,
  //       downloadType,
  //       matrixData
  //     );
  //     break;
  //   case DownloadFormat.pdf:
  //     return generatePdfFile(
  //       inputData.name,
  //       inputData.description,
  //       inputData.algorithmType,
  //       downloadType,
  //       matrixData
  //     );
  //     break;
  //   case DownloadFormat.excel:
  //     return generateExcelFile(
  //       inputData.name,
  //       inputData.description,
  //       inputData.algorithmType,
  //       downloadType,
  //       matrixData
  //     );
  //     break;
  //   default:
  //     console.error("Не підтримуваний формат.");
  // }
};

const generatePdfFile = (
  examSheetName: string,
  description: string,
  algorithmType: AlgorithmType,
  downloadType: DownloadType,
  matrixData: MatrixData
) => {
  if (isSchedulingType(algorithmType)) {
    return generateSchedulingPdf(
      examSheetName,
      description,
      algorithmType,
      downloadType,
      matrixData
    );
  }
};

const generateExcelFile = (
  examSheetName: string,
  description: string,
  algorithmType: AlgorithmType,
  downloadType: DownloadType,
  matrixData: MatrixData
) => {
  if (isSchedulingType(algorithmType)) {
    return generateSchedulingExcel(
      examSheetName,
      description,
      algorithmType,
      downloadType,
      matrixData
    );
  }
};
