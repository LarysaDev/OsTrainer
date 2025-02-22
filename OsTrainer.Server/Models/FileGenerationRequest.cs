using OsTrainer.Server.Models.Enum;

namespace OsTrainer.Server.Models
{
    public class FileGenerationRequest
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public AlgorithmType AlgorithmType { get; set; }
        public string ArrivalTimes { get; set; }
        public string BurstTimes { get; set; }
        public string Priorities { get; set; }
        public string TimeQuantum { get; set; }
        public string PageRequests { get; set; }
        public int? Frames { get; set; }
        public int? Resources { get; set; }
        public int? Processes { get; set; }
        public string OS { get; set; }
    }
}
