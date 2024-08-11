using Microsoft.AspNetCore.Identity;
namespace OsTrainer.Server.Data
{
    public class AppUser : IdentityUser
    {
        public bool IsStudent { get; set; }
        public bool IsTeacher { get; set; }
        public ICollection<Assignment> AssignmentsAsStudent { get; set; }
        public ICollection<Assignment> AssignmentsAsTeacher { get; set; }
    }
}
