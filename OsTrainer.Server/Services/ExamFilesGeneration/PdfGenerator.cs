using OsTrainer.Server.Models.Enum;
using OsTrainer.Server.Models;
using iText.Kernel.Pdf;
using iText.Layout;
using iText.Layout.Element;
using iText.Layout.Properties;
using iText.Kernel.Colors;
using iText.Layout.Borders;
using iText.Kernel.Font;
using iText.IO.Font;
using iText.IO.Font.Constants;

namespace OsTrainer.Server.Services.ExamFilesGeneration
{
    public class PdfGenerator : IFileGenerator
    {
        private readonly PdfFont font;

        public PdfGenerator()
        {
            string fontPath = "C:\\Users\\HP\\Desktop\\Диплом\\OsTrainer\\OsTrainer.Server\\Services\\ExamFilesGeneration\\Helper\\Roboto-Regular.ttf";
            font = PdfFontFactory.CreateFont(fontPath, PdfEncodings.IDENTITY_H);
        }

        public byte[] GenerateFile(FileGenerationRequest inputData, MatrixData matrixData, DownloadType type)
        {
            using (var memoryStream = new MemoryStream())
            {
                using (var pdfWriter = new PdfWriter(memoryStream))
                using (var pdf = new PdfDocument(pdfWriter))
                using (var document = new Document(pdf))
                {
                    document.Add(CreateParagraph(inputData.Name, true, 14));

                    document.Add(CreateParagraph(inputData.Description, false, 14));

                    document.Add(CreateParagraph($"Алгоритм для опрацювання: {inputData.AlgorithmType}", false, 14));

                    if (IsSchedulingType(inputData.AlgorithmType))
                    {
                        document.Add(CreateParagraph($"Час прибуття: {inputData.ArrivalTimes}", false, 12));
                        document.Add(CreateParagraph($"Час виконання: {inputData.BurstTimes}", false, 12));

                        if (inputData.AlgorithmType == AlgorithmType.PRIORITY_NON_PREEMPTIVE ||
                            inputData.AlgorithmType == AlgorithmType.PRIORITY_PREEMPTIVE)
                        {
                            document.Add(CreateParagraph($"Пріоритети: {inputData.Priorities}", false, 12));
                            document.Add(CreateParagraph($"Операційна система: {inputData.OS}", false, 12));
                        }

                        if (inputData.AlgorithmType == AlgorithmType.RR)
                        {
                            document.Add(CreateParagraph($"Квант часу: {inputData.TimeQuantum}", false, 12));
                        }
                    }
                    else
                    {
                        document.Add(CreateParagraph($"Запити сторінок: {inputData.PageRequests}", false, 12));
                        document.Add(CreateParagraph($"Кількість кадрів: {inputData.Frames}", false, 12));
                    }

                    if (IsSchedulingType(inputData.AlgorithmType))
                    {
                        document.Add(CreateParagraph("Стани процесів", true, 12));
                        document.Add(CreateParagraph("-: Виконання не розпочалось, e: Виконується, w: Очікує", false, 12));
                    }

                    document.Add(CreateParagraph("Таблиця результатів", true, 14));

                    var matrix = type == DownloadType.ToSolve ? matrixData.UserMatrix : matrixData.CorrectMatrix;
                    foreach (var table in GenerateTables(matrix))
                    {
                        document.Add(table);
                    }
                }

                return memoryStream.ToArray();
            }
        }

        private Paragraph CreateParagraph(string text, bool bold, float fontSize)
        {
            var paragraph = new Paragraph(text)
                .SetFont(font)
                .SetFontSize(fontSize);

            return paragraph;
        }

        private List<Table> GenerateTables(object?[][] matrix)
        {
            const int MaxColumns = 15;
            const float TableSpacing = 20f;

            var tables = new List<Table>();
            int columnCount = matrix[0].Length;
            int tableCount = (int)Math.Ceiling((double)columnCount / MaxColumns);

            for (int tableIndex = 0; tableIndex < tableCount; tableIndex++)
            {
                int startColumn = tableIndex * MaxColumns;
                int endColumn = Math.Min((tableIndex + 1) * MaxColumns, columnCount);
                int currentTableColumns = endColumn - startColumn;

                var table = new Table(currentTableColumns)
                    .UseAllAvailableWidth()
                    .SetMarginTop(tableIndex > 0 ? TableSpacing : 0);

                // Add rows
                foreach (var fullRow in matrix)
                {
                    var rowSegment = fullRow.Skip(startColumn).Take(currentTableColumns);

                    foreach (var cell in rowSegment)
                    {
                        string cellText = cell switch
                        {
                            null => "",
                            string str => str,
                            bool b => b.ToString(),
                            int i => i.ToString(),
                            double d => d.ToString(),
                            _ => cell.ToString() ?? ""
                        };

                        var tableCell = new Cell()
                            .Add(new Paragraph(cellText).SetFont(font))
                            .SetBorder(new SolidBorder(ColorConstants.BLACK, 1))
                            .SetPadding(5)
                            .SetTextAlignment(TextAlignment.CENTER);

                        table.AddCell(tableCell);
                    }
                }

                tables.Add(table);
            }

            return tables;
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