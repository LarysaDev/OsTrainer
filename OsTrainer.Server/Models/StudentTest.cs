using OsTrainer.Server.Data;
using OsTrainer.Server.Models.TestGeneration;

namespace OsTrainer.Server.Models
{
    public class StudentTest
    {
        public int Id { get; set; }
        public int StudentId { get; set; }
        public AppUser Student { get; set; }
        public DateTime TakenAt { get; set; }
        public List<StudentTestAnswer> Answers { get; set; }
    }
}
