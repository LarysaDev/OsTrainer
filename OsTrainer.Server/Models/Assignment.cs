using OsTrainer.Server.Data;

public class Assignment
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string AlgorithmType { get; set; } // e.g., FCFS, SJF, etc.
    public string ArrivalTimes { get; set; } // Store as a comma-separated string or a JSON array
    public string BurstTimes { get; set; } // Store as a comma-separated string or a JSON array

    // Relationship to AppUser
    public string StudentId { get; set; }
    public AppUser Student { get; set; }

    public string TeacherId { get; set; }
    public AppUser Teacher { get; set; }
}