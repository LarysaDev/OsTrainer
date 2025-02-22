using Microsoft.AspNetCore.Mvc;
using OsTrainer.Server.Services.PageReplacement;

namespace OsTrainer.Server.Controllers.NotUsed
{
    [ApiController]
    [Route("api/[controller]")]
    public class PageReplacementController : ControllerBase
    {
        private readonly PageReplacementService pageReplacementService;

        public PageReplacementController()
        {
            pageReplacementService = new PageReplacementService();
        }

        [HttpPost("fifo")]
        public PageReplacementResults ExecuteFIFO([FromBody] PageReplacementData data)
        {
            return pageReplacementService.FIFO(data);
        }

        [HttpPost("clock")]
        public PageReplacementResults ExecuteClock([FromBody] PageReplacementData data)
        {
            return pageReplacementService.Clock(data);
        }

        [HttpPost("lru")]
        public PageReplacementResults ExecuteLRU([FromBody] PageReplacementData data)
        {
            return pageReplacementService.LRU(data);
        }

        [HttpPost("lru-stack")]
        public PageReplacementResults ExecuteLRUStack([FromBody] PageReplacementData data)
        {
            return pageReplacementService.LRUStack(data);
        }

        [HttpPost("lfu")]
        public PageReplacementResults ExecuteLFU([FromBody] PageReplacementData data)
        {
            return pageReplacementService.LFU(data);
        }

        [HttpPost("mfu")]
        public PageReplacementResults ExecuteMFU([FromBody] PageReplacementData data)
        {
            return pageReplacementService.MFU(data);
        }
    }
}
