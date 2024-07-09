using OsTrainer.Server.Models.Scheduling;

namespace OsTrainer.Server.Services.Scheduling
{
    public class SchedulingService
    {
        public List<Process> PerformFCFS(List<Process> processes)
        {
            int currentTime = 0;

            foreach (var process in processes.OrderBy(p => p.ArrivalTime))
            {
                if (currentTime < process.ArrivalTime)
                {
                    currentTime = process.ArrivalTime;
                }

                process.CompletionTime = currentTime + process.BurstTime;
                process.TurnaroundTime = process.CompletionTime - process.ArrivalTime;
                process.WaitingTime = process.TurnaroundTime - process.BurstTime;

                currentTime = process.CompletionTime;
            }

            return processes;
        }
    }
}
