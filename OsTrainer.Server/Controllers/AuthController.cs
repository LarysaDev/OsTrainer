using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using OsTrainer.Server.Data;
using OsTrainer.Server.Services.JWT;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Google.Apis.Auth;

namespace OsTrainer.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly IJwtTokenGenerator _jwtTokenGenerator;

        public AuthController(
            UserManager<AppUser> userManager,
            SignInManager<AppUser> signInManager,
            IJwtTokenGenerator jwtTokenGenerator)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _jwtTokenGenerator = jwtTokenGenerator;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            if (model == null || string.IsNullOrWhiteSpace(model.Email) ||
                string.IsNullOrWhiteSpace(model.Password) || string.IsNullOrWhiteSpace(model.Role))
            {
                return BadRequest("Invalid registration data.");
            }

            var user = new AppUser
            {
                UserName = string.IsNullOrEmpty(model.UserName) ? model.Email : model.UserName,
                Email = model.Email
            };

            var result = await _userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            var roleResult = await _userManager.AddToRoleAsync(user, model.Role);
            if (!roleResult.Succeeded)
            {
                await _userManager.DeleteAsync(user);
                return BadRequest(roleResult.Errors);
            }

            return Ok(new { message = "Registration successful" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                return Unauthorized("Invalid email or password.");
            }

            var result = await _signInManager.PasswordSignInAsync(user.UserName, model.Password, false, false);
            if (!result.Succeeded)
            {
                return Unauthorized("Invalid email or password.");
            }

            var roles = await _userManager.GetRolesAsync(user);
            var jwtToken = _jwtTokenGenerator.GenerateJwtToken(user, roles.FirstOrDefault());

            var refreshToken = _jwtTokenGenerator.GenerateRefreshToken();
            user.RefreshTokens.Add(refreshToken);
            await _userManager.UpdateAsync(user);

            return Ok(new
            {
                Role = roles.FirstOrDefault(),
                Token = jwtToken,
                RefreshToken = refreshToken.Token
            });
        }

        [Authorize]
        [HttpGet("profile")]
        public async Task<UserProfile> GetProfileData()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return new UserProfile();
            }

            var user = await _userManager.FindByEmailAsync(userId);
            if (user == null)
            {
                return new UserProfile();
            }

            var roles = await _userManager.GetRolesAsync(user);
            return new UserProfile
            {
                Email = user.Email,
                UserName = user.UserName,
                Role = roles.FirstOrDefault()
            };
        }

        [HttpGet("getToken")]
        public async Task<string> GetToken(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            var roles = await _userManager.GetRolesAsync(user);

            return _jwtTokenGenerator.GenerateJwtToken(user, roles.FirstOrDefault());
        }

        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken([FromBody] string refreshToken)
        {
            var user = await _userManager.Users
                .Include(u => u.RefreshTokens)
                .FirstOrDefaultAsync(u => u.RefreshTokens.Any(t => t.Token == refreshToken));

            if (user == null)
            {
                return Unauthorized("Invalid refresh token.");
            }

            var token = user.RefreshTokens.FirstOrDefault(t => t.Token == refreshToken);
            if (token == null || token.IsRevoked || token.Expires < DateTime.UtcNow)
            {
                return Unauthorized("Invalid or expired refresh token.");
            }

            var roles = await _userManager.GetRolesAsync(user);
            var newJwtToken = _jwtTokenGenerator.GenerateJwtToken(user, roles.FirstOrDefault());

            return Ok(new { Token = newJwtToken });
        }

        [HttpPost("external-login")]
        public async Task<IActionResult> ExternalLogin([FromBody] ExternalLoginModel model)
        {
            var payload = await VerifyGoogleToken(model);
            if (payload == null)
            {
                return BadRequest("Invalid Google token.");
            }

            var info = new UserLoginInfo(model.Provider, payload.Subject, model.Provider);
            var user = await _userManager.FindByLoginAsync(info.LoginProvider, info.ProviderKey);

            if (user == null)
            {
                user = await _userManager.FindByEmailAsync(payload.Email);
                if (user == null)
                {
                    user = new AppUser
                    {
                        Email = payload.Email,
                        UserName = payload.Email
                    };
                    await _userManager.CreateAsync(user);
                    var roleResult = await _userManager.AddToRoleAsync(user, model.Role ?? "Student");
                    await _userManager.AddLoginAsync(user, info);
                }
                else
                {
                    await _userManager.AddLoginAsync(user, info);
                }
            }

            var roles = await _userManager.GetRolesAsync(user);
            var jwtToken = _jwtTokenGenerator.GenerateJwtToken(user, roles.FirstOrDefault());

            return Ok(new
            {
                Role = roles.FirstOrDefault() ?? "Student",
                Token = jwtToken
            });
        }

        private async Task<GoogleJsonWebSignature.Payload> VerifyGoogleToken(ExternalLoginModel externalAuth)
        {
            try
            {
                var settings = new GoogleJsonWebSignature.ValidationSettings()
                {
                    Audience = new List<string>() { "761148932094-2aog6ek6prnuu76jsk5cbrqefkt8u6cf.apps.googleusercontent.com" }
                };

                var payload = await GoogleJsonWebSignature.ValidateAsync(externalAuth.IdToken, settings);
                return payload;
            }
            catch
            {
                return null;
            }
        }
    }
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

    public class UserProfile
    {
        public string Email { get; set; }
        public string UserName { get; set; }
        public string Role { get; set; }
    }

}
