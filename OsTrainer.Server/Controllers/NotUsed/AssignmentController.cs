using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using OsTrainer.Server.Data;
using Microsoft.EntityFrameworkCore;
using OsTrainer.Server.Models.TestGeneration;

namespace OsTrainer.Server.Controllers.NotUsed
{
    [Route("api/[controller]")]
    [ApiController]
    public class AssignmentController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly AppDbContext _dbContext;

        public AssignmentController(UserManager<AppUser> userManager, AppDbContext dbContext)
        {
            _userManager = userManager;
            _dbContext = dbContext;
        }

        [HttpPost("createAssignment")]
        public async Task<IActionResult> CreateAssignment([FromBody] AssignmentModel model)
        {
            if (model == null)
            {
                return BadRequest("Invalid assignment data.");
            }

            var teacher = await _userManager.Users
                .FirstOrDefaultAsync(u => u.Email == model.TeacherEmail);

            if (teacher == null || !teacher.IsTeacher)
            {
                return BadRequest("Invalid teacher email.");
            }

            var students = await _userManager.Users
                .Where(u => model.StudentEmails.Contains(u.Email) && u.IsStudent)
                .ToListAsync();

            if (students.Count != model.StudentEmails.Length)
            {
                return BadRequest("One or more student emails are invalid.");
            }

            foreach (var student in students)
            {
                var assignment = new Assignment
                {
                    Name = model.Name,
                    Description = model.Description,
                    AlgorithmType = model.AlgorithmType,
                    ArrivalTimes = model.ArrivalTimes,
                    BurstTimes = model.BurstTimes,
                    StudentId = student.Id,
                    TeacherId = teacher.Id,
                };

                _dbContext.Assignments.Add(assignment);
            }

            await _dbContext.SaveChangesAsync();

            return Ok("Assignment(s) created successfully.");
        }

        [HttpGet("getTeacherAssignments")]
        public async Task<IActionResult> GetTeacherAssignments([FromQuery] string teacherEmail)
        {
            if (string.IsNullOrEmpty(teacherEmail))
            {
                return BadRequest("Teacher email is required.");
            }

            var teacher = await _userManager.Users
                .FirstOrDefaultAsync(u => u.Email == teacherEmail);

            if (teacher == null || !teacher.IsTeacher)
            {
                return BadRequest("Invalid teacher email.");
            }

            var assignments = await _dbContext.Assignments
                .Where(a => a.TeacherId == teacher.Id)
                .ToListAsync();

            if (assignments == null || !assignments.Any())
            {
                return NotFound("No assignments found for the given teacher.");
            }

            return Ok(assignments);
        }

        [HttpGet("getStudentAssignments")]
        public async Task<IActionResult> GetStudentAssignments([FromQuery] string studentEmail)
        {
            List<Assignment> assignments = new List<Assignment>();
            if (string.IsNullOrEmpty(studentEmail))
            {
                return Ok(new { Assignments = assignments });
            }

            var student = await _userManager.Users
                .FirstOrDefaultAsync(u => u.Email == studentEmail);

            if (student == null || !student.IsStudent)
            {
                return Ok(new { Assignments = assignments });
            }

            assignments = await _dbContext.Assignments
                .Where(a => a.StudentId == student.Id)
                .ToListAsync();

            if (assignments == null || !assignments.Any())
            {
                return Ok(new { Assignments = assignments });
            }

            return Ok(new { Assignments = assignments });
        }

        [HttpPut("editAssignment/{id}")]
        public async Task<IActionResult> EditAssignment(int id, [FromBody] EditAssignmentModel model)
        {
            if (model == null)
            {
                return BadRequest("Invalid assignment data.");
            }

            var assignment = await _dbContext.Assignments.FindAsync(id);
            if (assignment == null)
            {
                return NotFound("Assignment not found.");
            }

            assignment.Name = model.Name;
            assignment.Description = model.Description;
            assignment.ArrivalTimes = model.ArrivalTimes;
            assignment.BurstTimes = model.BurstTimes;

            await _dbContext.SaveChangesAsync();

            return Ok("Assignment updated successfully.");
        }

        [HttpDelete("removeAssignment/{id}")]
        public async Task<IActionResult> RemoveAssignment(int id)
        {
            var assignment = await _dbContext.Assignments.FindAsync(id);
            if (assignment == null)
            {
                return NotFound("Assignment not found.");
            }

            _dbContext.Assignments.Remove(assignment);

            await _dbContext.SaveChangesAsync();

            return Ok("Assignment removed successfully.");
        }

        [HttpGet("getRandomTests")]
        public async Task<IActionResult> GetRandomTests([FromQuery] int algorithmId)
        {
            List<TestQuestion> testQuestions = new List<TestQuestion>();

            testQuestions = await _dbContext.TestQuestions
                .Where(q => q.AlgorithmId == algorithmId)
                .OrderBy(q => Guid.NewGuid())
                .Take(5)
                .ToListAsync();

            if (testQuestions == null || !testQuestions.Any())
            {
                return NotFound(new { Message = "No questions found for the specified algorithm." });
            }

            return Ok(new { Tests = testQuestions });
        }

    }

    public class AssignmentModel
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string AlgorithmType { get; set; } // e.g., FCFS, SJF, etc.
        public string ArrivalTimes { get; set; } // Store as a comma-separated string or a JSON array
        public string BurstTimes { get; set; } // Store as a comma-separated string or a JSON array

        public string[] StudentEmails { get; set; }
        public string TeacherEmail { get; set; }
    }

    public class EditAssignmentModel
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string ArrivalTimes { get; set; }
        public string BurstTimes { get; set; }
    }

}
