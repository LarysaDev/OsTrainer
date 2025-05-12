namespace OsTrainer.Server.Models
{
    public class ExternalLoginModel
    {
        public string Provider { get; set; }
        public string IdToken { get; set; }
        public string Role { get; set; }
    }

    public class RegisterModel
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }
        public string UserName { get; set; }
    }

    public class LoginModel
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class RefreshTokenRequest
    {
        public string RefreshToken { get; set; }
    }

    public class UserProfileAuth
    {
        public string Email { get; set; }
        public string UserName { get; set; }
        public string Role { get; set; }
    }
}
