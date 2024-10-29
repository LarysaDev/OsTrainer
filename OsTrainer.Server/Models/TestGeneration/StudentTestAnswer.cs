namespace OsTrainer.Server.Models.TestGeneration
{
    public class StudentTestAnswer
    {
        public int Id { get; set; }
        public int TestQuestionId { get; set; }
        public TestQuestion TestQuestion { get; set; }
        public int SelectedOptionIndex { get; set; }
        public bool IsCorrect { get; set; }
        public int StudentTestId { get; set; }
        public StudentTest StudentTest { get; set; }
    }
}
