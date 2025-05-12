//using Microsoft.AspNetCore.Mvc;
//using OsTrainer.Server.Controllers;
//using System.Security.Claims;
//using OsTrainer.Server.Models;

//namespace OsTrainer.Server.Services
//{
//    public interface IAuthService
//    {
//        Task<IActionResult> RegisterAsync([FromBody] RegisterModel model);
//        Task<IActionResult> LoginAsync([FromBody] LoginModel model);
//        Task<UserProfileAuth> GetProfileDataAsync();
//        Task<string> GetTokenAsync(string email);
//        Task<IActionResult> RefreshTokenAsync([FromBody] string refreshToken);
//        Task<IActionResult> ExternalLoginAsync([FromBody] ExternalLoginModel model);
//    }
//}
