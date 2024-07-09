using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace OsTrainer.Server.Data
{
    public class AppDbContext : IdentityDbContext<AppUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        //public DbSet<Student> Students { get; set; }
        //public DbSet<Teacher> Teachers { get; set; }
        //public DbSet<Assignment> Assignments { get; set; }
        //public DbSet<StudentAssignment> StudentAssignments { get; set; }
        //public DbSet<InterimControl> InterimControls { get; set; }
        //public DbSet<StudentInterimControl> StudentInterimControls { get; set; }
        //public DbSet<GeneratedTask> GeneratedTasks { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

        //    // Налаштування зв'язків між таблицями
        //    builder.Entity<Student>()
        //        .HasOne(s => s.User)
        //        .WithOne()
        //        .HasForeignKey<Student>(s => s.StudentId);

        //    builder.Entity<Teacher>()
        //        .HasOne(t => t.User)
        //        .WithOne()
        //        .HasForeignKey<Teacher>(t => t.TeacherId);

        //    builder.Entity<Assignment>()
        //        .HasOne(a => a.Teacher)
        //        .WithMany(t => t.Assignments)
        //        .HasForeignKey(a => a.TeacherId);

        //    builder.Entity<StudentAssignment>()
        //        .HasOne(sa => sa.Student)
        //        .WithMany(s => s.StudentAssignments)
        //        .HasForeignKey(sa => sa.StudentId);

        //    builder.Entity<StudentAssignment>()
        //        .HasOne(sa => sa.Assignment)
        //        .WithMany(a => a.StudentAssignments)
        //        .HasForeignKey(sa => sa.AssignmentId);

        //    builder.Entity<InterimControl>()
        //        .HasOne(ic => ic.Teacher)
        //        .WithMany(t => t.InterimControls)
        //        .HasForeignKey(ic => ic.TeacherId);

        //    builder.Entity<StudentInterimControl>()
        //        .HasOne(sic => sic.Student)
        //        .WithMany(s => s.StudentInterimControls)
        //        .HasForeignKey(sic => sic.StudentId);

        //    builder.Entity<StudentInterimControl>()
        //        .HasOne(sic => sic.InterimControl)
        //        .WithMany(ic => ic.StudentInterimControls)
        //        .HasForeignKey(sic => sic.InterimControlId);

        //    builder.Entity<GeneratedTask>()
        //        .HasOne(gt => gt.Assignment)
        //        .WithMany(a => a.GeneratedTasks)
        //        .HasForeignKey(gt => gt.AssignmentId)
        //        .OnDelete(DeleteBehavior.Cascade);

        //    builder.Entity<GeneratedTask>()
        //        .HasOne(gt => gt.InterimControl)
        //        .WithMany(ic => ic.GeneratedTasks)
        //        .HasForeignKey(gt => gt.InterimControlId)
        //        .OnDelete(DeleteBehavior.Cascade);

        //    builder.Entity<GeneratedTask>()
        //        .HasOne(gt => gt.Student)
        //        .WithMany(s => s.GeneratedTasks)
        //        .HasForeignKey(gt => gt.StudentId)
        //        .OnDelete(DeleteBehavior.Cascade);
        }
    }

    //public class Student
    //    {
    //        public string StudentId { get; set; }
    //        public AppUser User { get; set; }
    //        public ICollection<StudentAssignment> StudentAssignments { get; set; }
    //        public ICollection<StudentInterimControl> StudentInterimControls { get; set; }
    //    }

    //    public class Teacher
    //    {
    //        public string TeacherId { get; set; }
    //        public AppUser User { get; set; }
    //        public ICollection<Assignment> Assignments { get; set; }
    //        public ICollection<ControlWork> ControlWorks { get; set; }
    //    }

    //    public class Assignment
    //    {
    //        public int AssignmentId { get; set; }
    //        public string Title { get; set; }
    //        public string Description { get; set; }
    //        public DateTime CreatedDate { get; set; }
    //        public string TeacherId { get; set; }
    //        public ICollection<StudentAssignment> StudentAssignments { get; set; }
    //    }

    //    public class StudentAssignment
    //    {
    //        public int StudentAssignmentId { get; set; }
    //        public string StudentId { get; set; }
    //        public int AssignmentId { get; set; }
    //        public int? Grade { get; set; }
    //    }

    //    public class ControlWork
    //    {
    //        public int ControlWorkId { get; set; }
    //        public string Title { get; set; }
    //        public string Description { get; set; }
    //        public DateTime StartDate { get; set; }
    //        public DateTime EndDate { get; set; }
    //        public string TeacherId { get; set; }
    //        public ICollection<StudentControlWork> StudentInterimControls { get; set; }
    //    }

    //    public class StudentControlWork
    //    {
    //        public int StudentInterimControlId { get; set; }
    //        public string StudentId { get; set; }
    //        public int ControlWorkId { get; set; }
    //        public int? Grade { get; set; }
    //    }

    //    public class GeneratedTask
    //    {
    //        public int GeneratedTaskId { get; set; }
    //        public string Title { get; set; }
    //        public string Description { get; set; }
    //        public int? AssignmentId { get; set; }
    //        public int? InterimControlId { get; set; }
    //        public string StudentId { get; set; }
    //    }
    }
