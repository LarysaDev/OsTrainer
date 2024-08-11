namespace OsTrainer.Server.Models
{
    public class Student
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email {  get; set; }
        public ICollection<Assignment> Assignments { get; set; }
    }
}
