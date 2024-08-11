using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using OsTrainer.Server.Data;
using Microsoft.EntityFrameworkCore;

namespace OsTrainer.Server.Controllers
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

            // Find the teacher by email
            var teacher = await _userManager.Users
                .FirstOrDefaultAsync(u => u.Email == model.TeacherEmail);

            if (teacher == null || !teacher.IsTeacher)
            {
                return BadRequest("Invalid teacher email.");
            }

            // Find the students by email
            var students = await _userManager.Users
                .Where(u => model.StudentEmails.Contains(u.Email) && u.IsStudent)
                .ToListAsync();

            if (students.Count != model.StudentEmails.Length)
            {
                return BadRequest("One or more student emails are invalid.");
            }

            // Create assignments for each student
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

            // Save changes to the database
            await _dbContext.SaveChangesAsync();

            return Ok("Assignment(s) created successfully.");
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

}
