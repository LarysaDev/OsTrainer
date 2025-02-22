using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using OsTrainer.Server.Models;
using OsTrainer.Server.Models.Enum;

namespace OsTrainer.Server.Services.ExamFilesGeneration
{
    public class WordGenerator : IFileGenerator
    {
        public byte[] GenerateFile(FileGenerationRequest inputData, MatrixData matrixData, DownloadType type)
        {
            using (var memoryStream = new MemoryStream())
            {
                using (WordprocessingDocument wordDocument = WordprocessingDocument.Create(memoryStream, WordprocessingDocumentType.Document))
                {
                    var mainPart = wordDocument.AddMainDocumentPart();
                    mainPart.Document = new Document();
                    var body = mainPart.Document.AppendChild(new Body());

                    body.AppendChild(CreateParagraph(inputData.Name, true, 14));

                    body.AppendChild(CreateParagraph(inputData.Description, false, 14));

                    body.AppendChild(CreateParagraph($"Алгоритм для опрацювання: {inputData.AlgorithmType}", false, 14));

                    if (IsSchedulingType(inputData.AlgorithmType))
                    {
                        body.AppendChild(CreateParagraph($"Час прибуття: {inputData.ArrivalTimes}", false, 12));
                        body.AppendChild(CreateParagraph($"Час виконання: {inputData.BurstTimes}", false, 12));

                        if (inputData.AlgorithmType == AlgorithmType.PRIORITY_NON_PREEMPTIVE || inputData.AlgorithmType == AlgorithmType.PRIORITY_PREEMPTIVE )
                        {
                            body.AppendChild(CreateParagraph($"Пріоритети: {inputData.Priorities}", false, 12));
                            body.AppendChild(CreateParagraph($"Операційна система: {inputData.OS}", false, 12));
                        }

                        if (inputData.AlgorithmType == AlgorithmType.RR)
                        {
                            body.AppendChild(CreateParagraph($"Квант часу: {inputData.TimeQuantum}", false, 12));
                        }
                    }
                    else
                    {
                        body.AppendChild(CreateParagraph($"Запити сторінок: {inputData.PageRequests}", false, 12));
                        body.AppendChild(CreateParagraph($"Кількість кадрів: {inputData.Frames}", false, 12));
                    }

                    if (IsSchedulingType(inputData.AlgorithmType))
                    {
                        body.AppendChild(CreateParagraph("Стани процесів", true, 12));
                        body.AppendChild(CreateParagraph("-: Виконання не розпочалось, e: Виконується, w: Очікує", false, 12));
                    }

                    body.AppendChild(CreateParagraph("Таблиця результатів", true, 14));
                    if(type is DownloadType.ToSolve)
                    {
                        body.Append(GenerateTable(matrixData.UserMatrix));
                    }
                    else
                    {
                        body.Append(GenerateTable(matrixData.CorrectMatrix));
                    }

                    mainPart.Document.Save();
                }

                return memoryStream.ToArray();
            }
        }

        private static Paragraph CreateParagraph(string text, bool bold, int fontSize)
        {
            var runProperties = new RunProperties();

            if (bold)
            {
                runProperties.Append(new Bold());
            }

            runProperties.Append(new FontSize() { Val = (fontSize * 2).ToString() });

            return new Paragraph(new Run(runProperties, new Text(text)));
        }

        private static List<OpenXmlCompositeElement> GenerateTable(object?[][] matrix)
        {
            const int MaxColumns = 15;
            const int PageWidthTwips = 10_000;
            const double LeftRightMarginPercent = 0.05;
            const int TableSpacing = 200;

            var tables = new List<OpenXmlCompositeElement>();

            int maxColumnCount = matrix.Max(row => row.Length);
            int columnCount = matrix[0].Length;
            int tableCount = (int)Math.Ceiling((double)columnCount / MaxColumns);

            for (int tableIndex = 0; tableIndex < tableCount; tableIndex++)
            {
                if (tableIndex > 0)
                {
                    var spacing = new Paragraph(
                        new ParagraphProperties(
                            new SpacingBetweenLines { Before = TableSpacing.ToString(), After = "0" }
                        )
                    );
                    tables.Add(spacing);
                }

                Table table = new Table();
                TableProperties tableProperties = new TableProperties(
                    new TableStyle { Val = "TableGrid" },
                    new TableWidth { Type = TableWidthUnitValues.Dxa, Width = PageWidthTwips.ToString() }
                );
                table.Append(tableProperties);

                int startColumn = tableIndex * MaxColumns;
                int endColumn = Math.Min((tableIndex + 1) * MaxColumns, columnCount);
                int currentTableColumns = endColumn - startColumn;

                int availableWidth = (int)(PageWidthTwips * (1 - 2 * LeftRightMarginPercent));
                int columnWidth = availableWidth / 15;

                var gridCols = new TableGrid();
                for (int i = 0; i < currentTableColumns; i++)
                {
                    gridCols.Append(new GridColumn { Width = columnWidth.ToString() });
                }
                table.Append(gridCols);

                foreach (var fullRow in matrix)
                {
                    var tableRow = new TableRow();

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

                        var tableCell = new TableCell(new Paragraph(new Run(new Text(cellText))));
                        TableCellProperties cellProperties = new TableCellProperties(
                            new TableCellBorders(
                                new TopBorder { Val = new EnumValue<BorderValues>(BorderValues.Single), Size = 4 },
                                new BottomBorder { Val = new EnumValue<BorderValues>(BorderValues.Single), Size = 4 },
                                new LeftBorder { Val = new EnumValue<BorderValues>(BorderValues.Single), Size = 4 },
                                new RightBorder { Val = new EnumValue<BorderValues>(BorderValues.Single), Size = 4 }
                            ),
                            new TableCellWidth { Type = TableWidthUnitValues.Dxa, Width = columnWidth.ToString() }
                        );
                        tableCell.Append(cellProperties);
                        tableRow.Append(tableCell);
                    }
                    table.Append(tableRow);
                }

                tables.Add(table);
            }

            return tables;
        }


        private static bool IsSchedulingType(AlgorithmType algorithmType)
        {
            return algorithmType == AlgorithmType.FCFS || algorithmType == AlgorithmType.SJF_PREEMPTIVE || algorithmType == AlgorithmType.SJF_NON_PREEMPTIVE ||
                   algorithmType == AlgorithmType.PRIORITY_NON_PREEMPTIVE || algorithmType == AlgorithmType.PRIORITY_PREEMPTIVE || algorithmType == AlgorithmType.RR;
        }
    }
}
