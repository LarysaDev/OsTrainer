using OsTrainer.Server.Models.Enum;
using OsTrainer.Server.Models;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using System.Drawing;

namespace OsTrainer.Server.Services.ExamFilesGeneration
{
    public class ExcelGenerator : IFileGenerator
    {
        public byte[] GenerateFile(FileGenerationRequest inputData, MatrixData matrixData, DownloadType type)
        {
            // Set EPPlus license context
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            using (var package = new ExcelPackage())
            {
                var worksheet = package.Workbook.Worksheets.Add("Results");
                int currentRow = 1;

                // Title
                WriteFormattedCell(worksheet, currentRow, 1, inputData.Name, true, 14);
                currentRow++;

                // Description
                WriteFormattedCell(worksheet, currentRow, 1, inputData.Description, false, 14);
                currentRow++;

                // Algorithm Type
                WriteFormattedCell(worksheet, currentRow, 1, $"Алгоритм для опрацювання: {inputData.AlgorithmType}", false, 14);
                currentRow++;

                if (IsSchedulingType(inputData.AlgorithmType))
                {
                    WriteFormattedCell(worksheet, currentRow, 1, $"Час прибуття: {inputData.ArrivalTimes}", false, 12);
                    currentRow++;

                    WriteFormattedCell(worksheet, currentRow, 1, $"Час виконання: {inputData.BurstTimes}", false, 12);
                    currentRow++;

                    if (inputData.AlgorithmType == AlgorithmType.PRIORITY_NON_PREEMPTIVE ||
                        inputData.AlgorithmType == AlgorithmType.PRIORITY_PREEMPTIVE)
                    {
                        WriteFormattedCell(worksheet, currentRow, 1, $"Пріоритети: {inputData.Priorities}", false, 12);
                        currentRow++;

                        WriteFormattedCell(worksheet, currentRow, 1, $"Операційна система: {inputData.OS}", false, 12);
                        currentRow++;
                    }

                    if (inputData.AlgorithmType == AlgorithmType.RR)
                    {
                        WriteFormattedCell(worksheet, currentRow, 1, $"Квант часу: {inputData.TimeQuantum}", false, 12);
                        currentRow++;
                    }
                }
                else
                {
                    WriteFormattedCell(worksheet, currentRow, 1, $"Запити сторінок: {inputData.PageRequests}", false, 12);
                    currentRow++;

                    WriteFormattedCell(worksheet, currentRow, 1, $"Кількість кадрів: {inputData.Frames}", false, 12);
                    currentRow++;
                }

                if (IsSchedulingType(inputData.AlgorithmType))
                {
                    WriteFormattedCell(worksheet, currentRow, 1, "Стани процесів", true, 12);
                    currentRow++;

                    WriteFormattedCell(worksheet, currentRow, 1, "-: Виконання не розпочалось, e: Виконується, w: Очікує", false, 12);
                    currentRow++;
                }

                // Results table title
                WriteFormattedCell(worksheet, currentRow, 1, "Таблиця результатів", true, 14);
                currentRow++;

                // Add the matrix
                var matrix = type == DownloadType.ToSolve ? matrixData.UserMatrix : matrixData.CorrectMatrix;
                WriteMatrix(worksheet, currentRow, matrix);

                // Auto-fit columns
                worksheet.Cells[worksheet.Dimension.Address].AutoFitColumns();

                return package.GetAsByteArray();
            }
        }

        private void WriteFormattedCell(ExcelWorksheet worksheet, int row, int col, string text, bool isBold, float fontSize)
        {
            var cell = worksheet.Cells[row, col];
            cell.Value = text;
            cell.Style.Font.Size = fontSize;
            cell.Style.Font.Bold = isBold;
            cell.Style.Font.Name = "Calibri";
        }

        private void WriteMatrix(ExcelWorksheet worksheet, int startRow, object?[][] matrix)
        {
            for (int rowIndex = 0; rowIndex < matrix.Length; rowIndex++)
            {
                for (int colIndex = 0; colIndex < matrix[rowIndex].Length; colIndex++)
                {
                    var cell = worksheet.Cells[startRow + rowIndex, colIndex + 1];
                    var value = matrix[rowIndex][colIndex];

                    string cellValue = value switch
                    {
                        null => "",
                        string str => str,
                        bool b => b.ToString(),
                        int i => i.ToString(),
                        double d => d.ToString(),
                        _ => value.ToString() ?? ""
                    };

                    cell.Value = cellValue;

                    // Apply border
                    cell.Style.Border.Top.Style = ExcelBorderStyle.Thin;
                    cell.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                    cell.Style.Border.Left.Style = ExcelBorderStyle.Thin;
                    cell.Style.Border.Right.Style = ExcelBorderStyle.Thin;

                    // Center alignment
                    cell.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                    cell.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                }
            }
        }

        private static bool IsSchedulingType(AlgorithmType algorithmType)
        {
            return algorithmType == AlgorithmType.FCFS ||
                   algorithmType == AlgorithmType.SJF_PREEMPTIVE ||
                   algorithmType == AlgorithmType.SJF_NON_PREEMPTIVE ||
                   algorithmType == AlgorithmType.PRIORITY_NON_PREEMPTIVE ||
                   algorithmType == AlgorithmType.PRIORITY_PREEMPTIVE ||
                   algorithmType == AlgorithmType.RR;
        }
    }
}
