using Microsoft.AspNetCore.Mvc;
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
    }

    public class RoundRobinInput
    {
        public List<Process> Processes { get; set; }
        public int TimeQuantum { get; set; }
    }
}
