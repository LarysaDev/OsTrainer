using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using OsTrainer.Server.Models;
using OsTrainer.Server.Models.Enum;

namespace OsTrainer.Server.Services.ExamFilesGeneration
{
    public class WordGenerator : IFileGenerator
    {
        public byte[] GenerateFile(FileGenerationRequest inputData, MatrixData matrixData)
        {
            using (var memoryStream = new MemoryStream())
            {
                using (WordprocessingDocument wordDocument = WordprocessingDocument.Create(memoryStream, WordprocessingDocumentType.Document))
                {
                    var mainPart = wordDocument.AddMainDocumentPart();
                    mainPart.Document = new Document();
                    var body = mainPart.Document.AppendChild(new Body());

                    body.AppendChild(CreateParagraph(inputData.Name, true, 28));

                    body.AppendChild(CreateParagraph(inputData.Description, false, 24));

                    body.AppendChild(CreateParagraph($"Алгоритм для опрацювання: {inputData.AlgorithmType}", false, 24));

                    if (IsSchedulingType(inputData.AlgorithmType))
                    {
                        body.AppendChild(CreateParagraph($"Час прибуття: {inputData.ArrivalTimes}", false, 22));
                        body.AppendChild(CreateParagraph($"Час виконання: {inputData.BurstTimes}", false, 22));

                        if (inputData.AlgorithmType == AlgorithmType.PRIORITY_NON_PREEMPTIVE || inputData.AlgorithmType == AlgorithmType.PRIORITY_PREEMPTIVE )
                        {
                            body.AppendChild(CreateParagraph($"Пріоритети: {inputData.Priorities}", false, 22));
                            body.AppendChild(CreateParagraph($"Операційна система: {inputData.OS}", false, 22));
                        }
                    }
                    else
                    {
                        body.AppendChild(CreateParagraph($"Запити сторінок: {inputData.PageRequests}", false, 22));
                        body.AppendChild(CreateParagraph($"Кількість кадрів: {inputData.Frames}", false, 22));
                    }

                    if (IsSchedulingType(inputData.AlgorithmType))
                    {
                        body.AppendChild(CreateParagraph("Стани процесів", true, 22));
                        body.AppendChild(CreateParagraph("-: Виконання не розпочалось, e: Виконується, w: Очікує", false, 22));
                    }

                    body.AppendChild(CreateParagraph("Таблиця результатів", true, 26));
                    body.AppendChild(GenerateTable(matrixData.CorrectMatrix));

                    mainPart.Document.Save();
                }

                return memoryStream.ToArray();
            }
        }

        private static Paragraph CreateParagraph(string text, bool bold, int fontSize)
        {
            return new Paragraph(new Run(
                new RunProperties(new Bold() { Val = bold ? OnOffValue.FromBoolean(true) : null }, new FontSize() { Val = (fontSize * 2).ToString() }),
                new Text(text)
            ));
        }

        private static Table GenerateTable(object?[][] matrix)
        {
            Table table = new Table();

            foreach (var row in matrix)
            {
                var tableRow = new TableRow();

                foreach (var cell in row)
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
                    tableRow.Append(tableCell);
                }
                table.Append(tableRow);
            }

            return table;
        }


        private static bool IsSchedulingType(AlgorithmType algorithmType)
        {
            return algorithmType == AlgorithmType.FCFS || algorithmType == AlgorithmType.SJF_PREEMPTIVE || algorithmType == AlgorithmType.SJF_NON_PREEMPTIVE ||
                   algorithmType == AlgorithmType.PRIORITY_NON_PREEMPTIVE || algorithmType == AlgorithmType.PRIORITY_PREEMPTIVE;
        }
    }
}
