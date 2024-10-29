namespace OsTrainer.Server.Models.TestGeneration
{
    public class TestQuestion
    {
        public int Id { get; set; }
        public string QuestionText { get; set; }
        public List<string> Options { get; set; } // JSON serialized list of options
        public int CorrectOptionIndex { get; set; } // Index of correct option
        public int AlgorithmId { get; set; }
        public Algorithm Algorithm { get; set; }
    }
}
