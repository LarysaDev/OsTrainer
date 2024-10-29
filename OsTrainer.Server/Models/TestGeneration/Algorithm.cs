namespace OsTrainer.Server.Models.TestGeneration
{
    public class Algorithm
    {
        public int Id { get; set; }
        public string Name { get; set; } // e.g., "FCFS", "Round Robin"
        public List<TestQuestion> Questions { get; set; }
    }
}
