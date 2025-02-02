using OsTrainer.Server.Data;
using OsTrainer.Server.Models;

namespace OsTrainer.Server.Services.JWT
{
    public interface IJwtTokenGenerator
    {
        public string GenerateJwtToken(AppUser user, string role);
        public RefreshToken GenerateRefreshToken();
    }
}
