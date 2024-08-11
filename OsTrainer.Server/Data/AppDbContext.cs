using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using OsTrainer.Server.Models;

namespace OsTrainer.Server.Data
{
    public class AppDbContext : IdentityDbContext<AppUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Assignment> Assignments { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Assignment>()
             .HasOne(a => a.Student)
             .WithMany(u => u.AssignmentsAsStudent)
             .HasForeignKey(a => a.StudentId)
             .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Assignment>()
                .HasOne(a => a.Teacher)
                .WithMany(u => u.AssignmentsAsTeacher)
                .HasForeignKey(a => a.TeacherId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
