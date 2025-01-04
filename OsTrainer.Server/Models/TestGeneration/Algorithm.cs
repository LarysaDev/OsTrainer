namespace OsTrainer.Server.Models.TestGeneration
{
    public class Algorithm
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public List<TestQuestion> Questions { get; set; }
    }
}
