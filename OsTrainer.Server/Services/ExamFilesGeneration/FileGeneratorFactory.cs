namespace OsTrainer.Server.Services.ExamFilesGeneration
{
    public interface IFileGeneratorFactory
    {
        IFileGenerator CreateGenerator(string fileType);
    }

    public class FileGeneratorFactory : IFileGeneratorFactory
    {
        private readonly IServiceProvider _serviceProvider;

        public FileGeneratorFactory(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        public IFileGenerator CreateGenerator(string fileType)
        {
            return fileType.ToLower() switch
            {
                "docx" => _serviceProvider.GetRequiredService<WordGenerator>(),
                "xlsx" => _serviceProvider.GetRequiredService<ExcelGenerator>(),
                "pdf" => _serviceProvider.GetRequiredService<PdfGenerator>(),
                _ => throw new ArgumentException("Unsupported file type", nameof(fileType))
            };
        }
    }
}
