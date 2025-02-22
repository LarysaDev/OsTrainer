using OsTrainer.Server.Models;
using OsTrainer.Server.Models.Enum;

namespace OsTrainer.Server.Services.ExamFilesGeneration
{
    public interface IFileGenerator
    {
        byte[] GenerateFile(FileGenerationRequest inputData, MatrixData matrixData, DownloadType type);
    }
}
