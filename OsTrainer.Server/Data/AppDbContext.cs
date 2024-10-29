using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using OsTrainer.Server.Models;
using OsTrainer.Server.Models.TestGeneration;

namespace OsTrainer.Server.Data
{
    public class AppDbContext : IdentityDbContext<AppUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Assignment> Assignments { get; set; }

        public DbSet<Algorithm> Algorithms { get; set; }
        public DbSet<TestQuestion> TestQuestions { get; set; }
        public DbSet<StudentTest> StudentTests { get; set; }
        public DbSet<StudentTestAnswer> StudentTestAnswers { get; set; }


        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<Algorithm>().HasData(
                new Algorithm { Id = 1, Name = "FCFS" },
                new Algorithm { Id = 2, Name = "Round Robin" },
                new Algorithm { Id = 3, Name = "SJF (Non-preemptive)" },
                new Algorithm { Id = 4, Name = "SJF (Preemptive)" },
                new Algorithm { Id = 5, Name = "Priority (Non-preemptive)" },
                new Algorithm { Id = 6, Name = "Priority (Preemptive)" }
            );

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

            builder.Entity<TestQuestion>().HasData(new TestData().Questions);
        }
    }
}
