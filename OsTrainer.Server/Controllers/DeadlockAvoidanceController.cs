using Microsoft.AspNetCore.Mvc;
using OsTrainer.Server.Services.AvoidingDeadlocks;

namespace OsTrainer.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DeadlockAvoidanceController : ControllerBase
    {
        private readonly AvoidingDeadlocksService avoidingDeadlocksService;

        public DeadlockAvoidanceController()
        {
            avoidingDeadlocksService = new AvoidingDeadlocksService();
        }

        [HttpPost("bankers-algorithm")]
        public IActionResult ExecuteBankersAlgorithm([FromBody] DeadlockInputData inputData)
        {
            var result = AvoidingDeadlocksService.BankersAlgorithm(inputData);
            return Ok(result);
        }

        [HttpPost("resource-allocation-graph")]
        public IActionResult ExecuteResourceAllocationGraphAlgorithm([FromBody] DeadlockInputData inputData)
        {
            var result = AvoidingDeadlocksService.ResourceAllocationGraphAlgorithm(inputData);
            return Ok(result);
        }
    }
}
