namespace OsTrainer.Server.Services.AvoidingDeadlocks
{
    public class DeadlockInputData
    {
        public int[,] MaxClaims { get; set; }
        public int[,] Allocation { get; set; }
        public int[] Available { get; set; }
        public int[,] Requests { get; set; }
    }
}
