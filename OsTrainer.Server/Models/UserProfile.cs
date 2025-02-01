namespace OsTrainer.Server.Models
{
    public class UserProfile
    {
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
        public DateTime JoinedAt {  get; set; }
    }
}
