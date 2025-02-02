using Microsoft.AspNetCore.Identity;
using OsTrainer.Server.Models;
namespace OsTrainer.Server.Data
{
    public class AppUser : IdentityUser
    {
        //TODO: remove bool props
        public bool IsStudent { get; set; }
        public bool IsTeacher { get; set; }
        public ICollection<Assignment> AssignmentsAsStudent { get; set; }
        public ICollection<Assignment> AssignmentsAsTeacher { get; set; }
        public List<RefreshToken> RefreshTokens { get; set; } = new();
    }
}
