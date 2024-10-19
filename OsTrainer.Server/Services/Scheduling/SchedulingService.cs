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

        public List<Process> PerformRoundRobin(RoundRobinInput roundRobinInput)
        {
            int currentTime = 0;
            Queue<Process> processQueue = new Queue<Process>(roundRobinInput.Processes.OrderBy(p => p.ArrivalTime));
            Queue<Process> readyQueue = new Queue<Process>();
            Dictionary<int, int> remainingTime = roundRobinInput.Processes.ToDictionary(p => p.Id, p => p.BurstTime);

            while (processQueue.Count > 0 || readyQueue.Count > 0)
            {
                while (processQueue.Count > 0 && processQueue.Peek().ArrivalTime <= currentTime)
                {
                    readyQueue.Enqueue(processQueue.Dequeue());
                }

                if (readyQueue.Count > 0)
                {
                    var process = readyQueue.Dequeue();
                    int timeSlice = Math.Min(roundRobinInput.TimeQuantum, remainingTime[process.Id]);
                    currentTime += timeSlice;
                    remainingTime[process.Id] -= timeSlice;

                    while (processQueue.Count > 0 && processQueue.Peek().ArrivalTime <= currentTime)
                    {
                        readyQueue.Enqueue(processQueue.Dequeue());
                    }

                    if (remainingTime[process.Id] > 0)
                    {
                        readyQueue.Enqueue(process);
                    }
                    else
                    {
                        process.CompletionTime = currentTime;
                        process.TurnaroundTime = process.CompletionTime - process.ArrivalTime;
                        process.WaitingTime = process.TurnaroundTime - process.BurstTime;
                    }
                }
                else
                {
                    if (processQueue.Count > 0)
                    {
                        currentTime = processQueue.Peek().ArrivalTime;
                    }
                }
            }

            return roundRobinInput.Processes;
        }

        public List<Process> PerformSJF(List<Process> processes, bool isPreemptive = false)
        {
            if (isPreemptive)
            {
                return PerformPreemptiveSJF(processes);
            }
            return PerformNonPreemptiveSJF(processes);
        }

        private List<Process> PerformNonPreemptiveSJF(List<Process> processes)
        {
            int currentTime = 0;
            var remainingProcesses = processes.ToList();
            var completedProcesses = new List<Process>();

            while (remainingProcesses.Any())
            {
                var availableProcesses = remainingProcesses
                    .Where(p => p.ArrivalTime <= currentTime)
                    .ToList();

                if (!availableProcesses.Any())
                {
                    currentTime = remainingProcesses.Min(p => p.ArrivalTime);
                    continue;
                }

                var shortestJob = availableProcesses
                    .OrderBy(p => p.BurstTime)
                    .First();

                shortestJob.CompletionTime = currentTime + shortestJob.BurstTime;
                shortestJob.TurnaroundTime = shortestJob.CompletionTime - shortestJob.ArrivalTime;
                shortestJob.WaitingTime = shortestJob.TurnaroundTime - shortestJob.BurstTime;

                currentTime = shortestJob.CompletionTime;
                remainingProcesses.Remove(shortestJob);
                completedProcesses.Add(shortestJob);
            }

            return completedProcesses;
        }

        private List<Process> PerformPreemptiveSJF(List<Process> processes)
        {
            int currentTime = 0;
            var remainingProcesses = processes.ToDictionary(
                p => p.Id,
                p => new { Process = p, RemainingTime = p.BurstTime }
            );

            while (remainingProcesses.Any())
            {
                var availableProcesses = remainingProcesses
                    .Where(kvp => kvp.Value.Process.ArrivalTime <= currentTime)
                    .ToList();

                if (!availableProcesses.Any())
                {
                    currentTime = remainingProcesses
                        .Min(kvp => kvp.Value.Process.ArrivalTime);
                    continue;
                }

                var shortestJob = availableProcesses
                    .OrderBy(kvp => kvp.Value.RemainingTime)
                    .First();

                int nextArrival = remainingProcesses
                    .Where(kvp => kvp.Value.Process.ArrivalTime > currentTime)
                    .Select(kvp => kvp.Value.Process.ArrivalTime)
                    .DefaultIfEmpty(int.MaxValue)
                    .Min();

                int timeSlice = Math.Min(
                    shortestJob.Value.RemainingTime,
                    nextArrival - currentTime
                );

                currentTime += timeSlice;
                var updatedRemainingTime = shortestJob.Value.RemainingTime - timeSlice;

                if (updatedRemainingTime == 0)
                {
                    shortestJob.Value.Process.CompletionTime = currentTime;
                    shortestJob.Value.Process.TurnaroundTime =
                        shortestJob.Value.Process.CompletionTime -
                        shortestJob.Value.Process.ArrivalTime;
                    shortestJob.Value.Process.WaitingTime =
                        shortestJob.Value.Process.TurnaroundTime -
                        shortestJob.Value.Process.BurstTime;
                    remainingProcesses.Remove(shortestJob.Key);
                }
                else
                {
                    remainingProcesses[shortestJob.Key] = new
                    {
                        Process = shortestJob.Value.Process,
                        RemainingTime = updatedRemainingTime
                    };
                }
            }

            return processes;
        }

        public List<Process> PerformPriorityScheduling(List<Process> processes, bool isPreemptive = false)
        {
            if (isPreemptive)
            {
                return PerformPreemptivePriorityScheduling(processes);
            }
            return PerformNonPreemptivePriorityScheduling(processes);
        }

        private List<Process> PerformNonPreemptivePriorityScheduling(List<Process> processes)
        {
            int currentTime = 0;
            var remainingProcesses = processes.ToList();
            var completedProcesses = new List<Process>();

            while (remainingProcesses.Any())
            {
                var availableProcesses = remainingProcesses
                    .Where(p => p.ArrivalTime <= currentTime)
                    .ToList();

                if (!availableProcesses.Any())
                {
                    currentTime = remainingProcesses.Min(p => p.ArrivalTime);
                    continue;
                }

                var highestPriorityProcess = availableProcesses
                    .OrderBy(p => p.Priority)
                    .ThenBy(p => p.ArrivalTime)
                    .First();

                highestPriorityProcess.CompletionTime = currentTime + highestPriorityProcess.BurstTime;
                highestPriorityProcess.TurnaroundTime = highestPriorityProcess.CompletionTime - highestPriorityProcess.ArrivalTime;
                highestPriorityProcess.WaitingTime = highestPriorityProcess.TurnaroundTime - highestPriorityProcess.BurstTime;

                currentTime = highestPriorityProcess.CompletionTime;
                remainingProcesses.Remove(highestPriorityProcess);
                completedProcesses.Add(highestPriorityProcess);
            }

            return completedProcesses;
        }

        private List<Process> PerformPreemptivePriorityScheduling(List<Process> processes)
        {
            int currentTime = 0;
            var remainingProcesses = processes.ToDictionary(
                p => p.Id,
                p => new { Process = p, RemainingTime = p.BurstTime }
            );

            while (remainingProcesses.Any())
            {
                var availableProcesses = remainingProcesses
                    .Where(kvp => kvp.Value.Process.ArrivalTime <= currentTime)
                    .ToList();

                if (!availableProcesses.Any())
                {
                    currentTime = remainingProcesses
                        .Min(kvp => kvp.Value.Process.ArrivalTime);
                    continue;
                }

                var highestPriorityProcess = availableProcesses
                    .OrderBy(kvp => kvp.Value.Process.Priority)
                    .ThenBy(kvp => kvp.Value.Process.ArrivalTime)
                    .First();

                int nextArrival = remainingProcesses
                    .Where(kvp => kvp.Value.Process.ArrivalTime > currentTime)
                    .Select(kvp => kvp.Value.Process.ArrivalTime)
                    .DefaultIfEmpty(int.MaxValue)
                    .Min();

                int timeSlice = Math.Min(
                    highestPriorityProcess.Value.RemainingTime,
                    nextArrival - currentTime
                );

                currentTime += timeSlice;
                var updatedRemainingTime = highestPriorityProcess.Value.RemainingTime - timeSlice;

                if (updatedRemainingTime == 0)
                {
                    highestPriorityProcess.Value.Process.CompletionTime = currentTime;
                    highestPriorityProcess.Value.Process.TurnaroundTime =
                        highestPriorityProcess.Value.Process.CompletionTime -
                        highestPriorityProcess.Value.Process.ArrivalTime;
                    highestPriorityProcess.Value.Process.WaitingTime =
                        highestPriorityProcess.Value.Process.TurnaroundTime -
                        highestPriorityProcess.Value.Process.BurstTime;
                    remainingProcesses.Remove(highestPriorityProcess.Key);
                }
                else
                {
                    remainingProcesses[highestPriorityProcess.Key] = new
                    {
                        Process = highestPriorityProcess.Value.Process,
                        RemainingTime = updatedRemainingTime
                    };
                }
            }

            return processes;
        }

    }

    public class RoundRobinInput
    {
        public List<Process> Processes { get; set; }
        public int TimeQuantum { get; set; }
    }
}
