using OsTrainer.Server.Models;

namespace OsTrainer.Server.Services.ExamFilesGeneration
{
    public interface IFileGenerator
    {
        byte[] GenerateFile(FileGenerationRequest inputData, MatrixData matrixData);
    }
}
