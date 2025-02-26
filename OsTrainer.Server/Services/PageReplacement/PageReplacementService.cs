namespace OsTrainer.Server.Services.PageReplacement
{
    public class PageReplacementService
    {
        public PageReplacementResults GenerateFifoMatrix(PageReplacementRequest request)
        {
            int columnCount = request.PageRequests.Length;
            List<List<int>> matrix = new List<List<int>>();
            List<bool> pageFaults = new List<bool>();

            Queue<int> frameQueue = new Queue<int>(request.FrameCount);
            HashSet<int> currentPages = new HashSet<int>();

            for (int row = 0; row < request.FrameCount; row++)
            {
                matrix.Add(Enumerable.Repeat(-1, columnCount).ToList());
            }

            for (int col = 0; col < columnCount; col++)
            {
                int page = request.PageRequests[col];

                if (!currentPages.Contains(page))
                {
                    pageFaults.Add(true);

                    if (frameQueue.Count < request.FrameCount)
                    {
                        frameQueue.Enqueue(page);
                        currentPages.Add(page);
                    }
                    else
                    {
                        int removedPage = frameQueue.Dequeue();
                        currentPages.Remove(removedPage);

                        frameQueue.Enqueue(page);
                        currentPages.Add(page);
                    }
                }
                else
                {
                    pageFaults.Add(false);
                }

                int rowIndex = 0;
                foreach (int item in frameQueue)
                {
                    matrix[rowIndex++][col] = item;
                }
            }

            return new PageReplacementResults(matrix, pageFaults);
        }


        //public PageReplacementResults Clock(PageReplacementData data)
        //{
        //    int pageFaults = 0;
        //    List<int> frames = new List<int>();
        //    List<bool> referenced = new List<bool>();
        //    List<int> finalFrames = new List<int>();

        //    foreach (int page in data.Pages)
        //    {
        //        if (!frames.Contains(page))
        //        {
        //            if (frames.Count == data.FrameCount)
        //            {
        //                int i = 0;
        //                while (referenced[i])
        //                {
        //                    referenced[i] = false;
        //                    i = (i + 1) % data.FrameCount;
        //                }
        //                frames[i] = page;
        //            }
        //            else
        //            {
        //                frames.Add(page);
        //                referenced.Add(true);
        //            }
        //            pageFaults++;
        //        }
        //        else
        //        {
        //            referenced[frames.IndexOf(page)] = true;
        //        }
        //        finalFrames = new List<int>(frames);
        //    }

        //    return new PageReplacementResults
        //    {
        //        PageFaults = pageFaults,
        //        FinalFrames = finalFrames
        //    };
        //}

        //public PageReplacementResults LRU(PageReplacementData data)
        //{
        //    int pageFaults = 0;
        //    Dictionary<int, int> frames = new Dictionary<int, int>();
        //    List<int> finalFrames = new List<int>();

        //    foreach (int page in data.Pages)
        //    {
        //        if (!frames.ContainsKey(page))
        //        {
        //            if (frames.Count == data.FrameCount)
        //            {
        //                int leastRecent = int.MaxValue;
        //                int leastRecentPage = 0;
        //                foreach (var entry in frames)
        //                {
        //                    if (entry.Value < leastRecent)
        //                    {
        //                        leastRecent = entry.Value;
        //                        leastRecentPage = entry.Key;
        //                    }
        //                }
        //                frames.Remove(leastRecentPage);
        //            }
        //            frames[page] = 0;
        //            pageFaults++;
        //        }
        //        else
        //        {
        //            foreach (var entry in frames)
        //            {
        //                if (entry.Key != page)
        //                {
        //                    frames[entry.Key]++;
        //                }
        //            }
        //            frames[page] = 0;
        //        }
        //        finalFrames = new List<int>(frames.Keys);
        //    }

        //    return new PageReplacementResults
        //    {
        //        PageFaults = pageFaults,
        //        FinalFrames = finalFrames
        //    };
        //}

        //public PageReplacementResults LRUStack(PageReplacementData data)
        //{
        //    int pageFaults = 0;
        //    Stack<int> frames = new Stack<int>();
        //    List<int> finalFrames = new List<int>();

        //    foreach (int page in data.Pages)
        //    {
        //        if (!frames.Contains(page))
        //        {
        //            if (frames.Count == data.FrameCount)
        //            {
        //                // Знаходимо індекс сторінки на вершині стека
        //                int indexToRemove = frames.Count - 1;
        //                while (indexToRemove >= 0 && frames.Peek() != page)
        //                {
        //                    indexToRemove--;
        //                    frames.Pop();
        //                }
        //                if (indexToRemove >= 0)
        //                {
        //                    frames.Pop();
        //                }
        //            }
        //            frames.Push(page);
        //            pageFaults++;
        //        }
        //        else
        //        {
        //            // Знаходимо індекс сторінки в стеку
        //            int indexToRemove = 0;
        //            while (frames.Peek() != page)
        //            {
        //                frames.Pop();
        //                indexToRemove++;
        //            }
        //            frames.Pop();
        //            frames.Push(page);
        //        }
        //        finalFrames = new List<int>(frames);
        //    }

        //    return new PageReplacementResults
        //    {
        //        PageFaults = pageFaults,
        //        FinalFrames = finalFrames
        //    };
        //}

        //public PageReplacementResults LFU(PageReplacementData data)
        //{
        //    int pageFaults = 0;
        //    Dictionary<int, int> frames = new Dictionary<int, int>();
        //    Dictionary<int, int> frequency = new Dictionary<int, int>();
        //    List<int> finalFrames = new List<int>();

        //    foreach (int page in data.Pages)
        //    {
        //        if (!frames.ContainsKey(page))
        //        {
        //            if (frames.Count == data.FrameCount)
        //            {
        //                int leastFrequent = int.MaxValue;
        //                int leastFrequentPage = 0;
        //                foreach (var entry in frames)
        //                {
        //                    if (frequency[entry.Key] < leastFrequent)
        //                    {
        //                        leastFrequent = frequency[entry.Key];
        //                        leastFrequentPage = entry.Key;
        //                    }
        //                    else if (frequency[entry.Key] == leastFrequent && entry.Value < frames[leastFrequentPage])
        //                    {
        //                        leastFrequentPage = entry.Key;
        //                    }
        //                }
        //                frames.Remove(leastFrequentPage);
        //                frequency.Remove(leastFrequentPage);
        //            }
        //            frames[page] = 0;
        //            frequency[page] = 1;
        //            pageFaults++;
        //        }
        //        else
        //        {
        //            frames[page] = 0;
        //            frequency[page]++;
        //        }
        //        finalFrames = new List<int>(frames.Keys);
        //    }

        //    return new PageReplacementResults
        //    {
        //        PageFaults = pageFaults,
        //        FinalFrames = finalFrames
        //    };
        //}

        //public PageReplacementResults MFU(PageReplacementData data)
        //{
        //    int pageFaults = 0;
        //    Dictionary<int, int> frames = new Dictionary<int, int>();
        //    Dictionary<int, int> frequency = new Dictionary<int, int>();
        //    List<int> finalFrames = new List<int>();

        //    foreach (int page in data.Pages)
        //    {
        //        if (!frames.ContainsKey(page))
        //        {
        //            if (frames.Count == data.FrameCount)
        //            {
        //                int mostFrequent = 0;
        //                int mostFrequentPage = 0;
        //                foreach (var entry in frames)
        //                {
        //                    if (frequency[entry.Key] > mostFrequent)
        //                    {
        //                        mostFrequent = frequency[entry.Key];
        //                        mostFrequentPage = entry.Key;
        //                    }
        //                    else if (frequency[entry.Key] == mostFrequent && entry.Value > frames[mostFrequentPage])
        //                    {
        //                        mostFrequentPage = entry.Key;
        //                    }
        //                }
        //                frames.Remove(mostFrequentPage);
        //                frequency.Remove(mostFrequentPage);
        //            }
        //            frames[page] = 0;
        //            frequency[page] = 1;
        //            pageFaults++;
        //        }
        //        else
        //        {
        //            frames[page] = 0;
        //            frequency[page]++;
        //        }
        //        finalFrames = new List<int>(frames.Keys);
        //    }

        //    return new PageReplacementResults
        //    {
        //        PageFaults = pageFaults,
        //        FinalFrames = finalFrames
        //    };
        //}
    }
}