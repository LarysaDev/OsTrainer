namespace OsTrainer.Server.Services.AvoidingDeadlocks
{
    public class AvoidingDeadlocksService
    {
        public static DeadlockOutputData BankersAlgorithm(DeadlockInputData inputData)
        {
            int processCount = inputData.Allocation.GetLength(0);
            int resourceCount = inputData.Available.Length;

            // Calculate Need = Max - Allocation
            int[,] Need = new int[processCount, resourceCount];
            for (int i = 0; i < processCount; i++)
            {
                for (int j = 0; j < resourceCount; j++)
                {
                    Need[i, j] = inputData.MaxClaims[i, j] - inputData.Allocation[i, j];
                }
            }

            bool[] finish = new bool[processCount];
            int[] work = (int[])inputData.Available.Clone();
            List<int> safeSequence = new List<int>();

            while (true)
            {
                bool found = false;
                for (int p = 0; p < processCount; p++)
                {
                    if (!finish[p])
                    {
                        // Check if Need <= Work
                        bool canProceed = true;
                        for (int r = 0; r < resourceCount; r++)
                        {
                            if (Need[p, r] > work[r])
                            {
                                canProceed = false;
                                break;
                            }
                        }

                        if (canProceed)
                        {
                            // Simulate allocation
                            for (int r = 0; r < resourceCount; r++)
                            {
                                work[r] += inputData.Allocation[p, r];
                            }
                            safeSequence.Add(p);
                            finish[p] = true;
                            found = true;
                        }
                    }
                }

                if (!found)
                {
                    break;
                }
            }

            // Check if all processes finished
            bool isSafe = true;
            foreach (bool f in finish)
            {
                if (!f)
                {
                    isSafe = false;
                    break;
                }
            }

            return new DeadlockOutputData
            {
                IsSafe = isSafe,
                SafeSequence = isSafe ? safeSequence : new List<int>()
            };
        }

        public static DeadlockOutputData ResourceAllocationGraphAlgorithm(DeadlockInputData inputData)
        {
            int processCount = inputData.Allocation.GetLength(0);  // Кількість процесів
            int resourceCount = inputData.Available.Length;        // Кількість ресурсів

            // Створення графу доступності, щоб перевіряти чи є безпечний порядок
            bool[] finish = new bool[processCount];
            int[] work = new int[resourceCount];
            Array.Copy(inputData.Available, work, resourceCount);  // Початково доступні ресурси

            List<int> safeSequence = new List<int>();              // Список безпечної послідовності

            bool progressMade;
            do
            {
                progressMade = false;
                for (int i = 0; i < processCount; i++)
                {
                    if (!finish[i])  // Якщо процес ще не завершився
                    {
                        bool canFinish = true;

                        // Перевіряємо, чи можуть усі запити поточного процесу бути задоволені
                        for (int j = 0; j < resourceCount; j++)
                        {
                            if (inputData.Requests[i, j] > work[j])
                            {
                                canFinish = false;
                                break;
                            }
                        }

                        // Якщо процес може завершитися, оновлюємо ресурси та позначаємо його як завершений
                        if (canFinish)
                        {
                            for (int j = 0; j < resourceCount; j++)
                            {
                                work[j] += inputData.Allocation[i, j];  // Звільнення ресурсів після завершення процесу
                            }

                            finish[i] = true;
                            safeSequence.Add(i);
                            progressMade = true;
                        }
                    }
                }
            } while (progressMade);

            // Перевірка, чи всі процеси можуть завершитись
            bool isSafe = true;
            for (int i = 0; i < processCount; i++)
            {
                if (!finish[i])  // Якщо залишився хоча б один незавершений процес, система небезпечна
                {
                    isSafe = false;
                    break;
                }
            }

            // Повертаємо результат у вигляді DeadlockOutputData
            return new DeadlockOutputData
            {
                IsSafe = isSafe,
                SafeSequence = isSafe ? safeSequence : new List<int>()
            };
        }
    }
}
