namespace OsTrainer.Server.Services.AvoidingDeadlocks
{
    public class DeadlockOutputData
    {
        public bool IsSafe { get; set; }
        public List<int> SafeSequence { get; set; }
    }
}
