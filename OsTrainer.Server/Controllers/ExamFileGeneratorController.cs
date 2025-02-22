using Microsoft.AspNetCore.Mvc;
using OsTrainer.Server.Models;
using OsTrainer.Server.Models.Enum;
using OsTrainer.Server.Services.ExamFilesGeneration;

namespace OsTrainer.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FileGeneratorController : ControllerBase
    {
        private readonly IFileGeneratorFactory _fileGeneratorFactory;

        public FileGeneratorController(IFileGeneratorFactory fileGeneratorFactory)
        {
            _fileGeneratorFactory = fileGeneratorFactory;
        }

        [HttpPost("generate")]
        public IActionResult GenerateFile([FromQuery] string fileType, [FromQuery] DownloadType type, [FromBody] FileGenerationRequestDto dto)
        {
            try
            {
                var generator = _fileGeneratorFactory.CreateGenerator(fileType);
                var fileBytes = generator.GenerateFile(dto.Request, dto.MatrixData, type);

                var contentType = fileType.ToLower() switch
                {
                    "docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    "excel" => "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    "pdf" => "application/pdf",
                    _ => "application/octet-stream"
                };

                return File(fileBytes, contentType, $"{dto.Request.Name}.${fileType}");
            }
            catch (Exception ex)
            {
                return BadRequest($"Error generating file: {ex.Message}");
            }
        }
    }
}
