using Microsoft.AspNetCore.Mvc;
using OsTrainer.Server.Models.Scheduling;
using OsTrainer.Server.Services.Scheduling;


namespace OsTrainer.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GanttChartController : ControllerBase
    {
        private readonly SchedulingService _schedulingService;

        public GanttChartController()
        {
            _schedulingService = new SchedulingService();
        }

        [HttpPost("fcfs")]
        public IActionResult GenerateFcFsGanttChart([FromBody] List<Process> processes)
        {
            var result = _schedulingService.PerformFCFS(processes);
            return Ok(result);
        }

        [HttpPost("rr")]
        public IActionResult GenerateRrGanttChart([FromBody] List<Process> processes, int timeQuantum)
        {
            var result = _schedulingService.PerformRoundRobin(processes, timeQuantum);
            return Ok(result);
        }
    }
}
