using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using OsTrainer.Server.Services.PageReplacement;

namespace OsTrainer.Server.Controllers.NotUsed
{
    [ApiController]
    [Route("api/[controller]")]
    public class PageReplacementController : ControllerBase
    {
        private readonly PageReplacementService _pageReplacementService;
        private readonly ILogger<PageReplacementController> _logger;

        public PageReplacementController(ILogger<PageReplacementController> logger)
        {
            _pageReplacementService = new PageReplacementService();
            _logger = logger;
        }

        [HttpPost("fifo")]
        public PageReplacementResults ExecuteFIFO([FromBody] PageReplacementRequest request)
        {
            if (request.PageRequests == null || request.PageRequests.Length == 0 || request.FrameCount <= 0)
            {
                _logger.LogError("Invalid input parameters");

                return null;
            }

            return _pageReplacementService.GenerateFifoMatrix(request);
        }

        //[HttpPost("clock")]
        //public PageReplacementResults ExecuteClock([FromBody] PageReplacementData data)
        //{
        //    return pageReplacementService.Clock(data);
        //}

        //[HttpPost("lru")]
        //public PageReplacementResults ExecuteLRU([FromBody] PageReplacementData data)
        //{
        //    return pageReplacementService.LRU(data);
        //}

        //[HttpPost("lru-stack")]
        //public PageReplacementResults ExecuteLRUStack([FromBody] PageReplacementData data)
        //{
        //    return pageReplacementService.LRUStack(data);
        //}

        //[HttpPost("lfu")]
        //public PageReplacementResults ExecuteLFU([FromBody] PageReplacementData data)
        //{
        //    return pageReplacementService.LFU(data);
        //}

        //[HttpPost("mfu")]
        //public PageReplacementResults ExecuteMFU([FromBody] PageReplacementData data)
        //{
        //    return pageReplacementService.MFU(data);
        //}
    }
}
