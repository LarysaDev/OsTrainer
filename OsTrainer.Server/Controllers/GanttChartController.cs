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
        public IList<Process> GenerateFcFsGanttChart([FromBody] List<Process> processes)
        {
            var result = _schedulingService.PerformFCFS(processes);
            return result;
        }

        [HttpPost("rr")]
        public IActionResult GenerateRrGanttChart([FromBody] RoundRobinInput roundRobinInput)
        {
            var result = _schedulingService.PerformRoundRobin(roundRobinInput);
            return Ok(result);
        }

        [HttpPost("preemptive_sjf")]
        public IActionResult GeneratePreemptiveSjfGanttChart([FromBody] List<Process> processes)
        {
            var result = _schedulingService.PerformSJF(processes, true);
            return Ok(result);
        }

        [HttpPost("nonpreemptive_sjf")]
        public IActionResult GenerateNonpreemptiveSjfGanttChart([FromBody] List<Process> processes)
        {
            var result = _schedulingService.PerformSJF(processes);
            return Ok(result);
        }

        [HttpPost("preemptive_priority")]
        public IActionResult GeneratePreemptivePriorityGanttChart([FromBody] List<Process> processes)
        {
            var result = _schedulingService.PerformPriorityScheduling(processes, true);
            return Ok(result);
        }

        [HttpPost("nonpreemptive_priority")]
        public IActionResult GenerateNonpreemptivePriorityGanttChart([FromBody] List<Process> processes)
        {
            var result = _schedulingService.PerformPriorityScheduling(processes);
            return Ok(result);
        }
    }
}
