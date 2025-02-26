namespace OsTrainer.Server.Services.PageReplacement
{
    public class PageReplacementRequest
    {
        public int[] PageRequests { get; set; } = Array.Empty<int>();
        public int FrameCount { get; set; }
    }
}
