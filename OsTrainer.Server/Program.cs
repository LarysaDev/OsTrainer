using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using OsTrainer.Server.Data;
using OsTrainer.Server.Services.ExamFilesGeneration;
using OsTrainer.Server.Services.JWT;
using OsTrainer.Server.Services.Scheduling;
using System.Security.Claims;
using System.Text;
using System.Text.Json.Serialization;

namespace OsTrainer.Server
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            var connectionString = builder.Configuration.GetConnectionString("AppDbContextConnection") ?? throw new InvalidOperationException("Invalid connection string");
            builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlServer(connectionString));

            builder.Services.AddAuthentication(x =>
            {
                x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidIssuer = "https://localhost:7111",
                    ValidAudience = "https://localhost:5173",
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes("PersykAsAKeyForOSTrainerSecretKey")),
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true
                };
            })
            .AddGoogle(googleOptions =>
            {
                googleOptions.ClientId = "761148932094-2aog6ek6prnuu76jsk5cbrqefkt8u6cf.apps.googleusercontent.com";
                googleOptions.ClientSecret = "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";
                googleOptions.CallbackPath = "/signin-google";
            });


            builder.Services.AddAuthorization();

            // Add services to the container.
            builder.Services.AddSingleton<IJwtTokenGenerator, JwtTokenGenerator>();

            builder.Services.AddIdentityApiEndpoints<AppUser>()
                .AddRoles<IdentityRole>()
                .AddEntityFrameworkStores<AppDbContext>();

            builder.Services.AddControllers()
                 .AddJsonOptions(options =>
                 {
                     options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
                     options.JsonSerializerOptions.WriteIndented = true;
                 });


            builder.Services.AddSingleton<SchedulingService>();

            builder.Services.AddSingleton<WordGenerator>();
            builder.Services.AddSingleton<PdfGenerator>();
            builder.Services.AddSingleton<ExcelGenerator>();

            builder.Services.AddSingleton<IFileGenerator>(sp => sp.GetRequiredService<WordGenerator>());
            builder.Services.AddSingleton<IFileGenerator>(sp => sp.GetRequiredService<PdfGenerator>());
            builder.Services.AddSingleton<IFileGenerator>(sp => sp.GetRequiredService<ExcelGenerator>());

            builder.Services.AddSingleton<IFileGeneratorFactory, FileGeneratorFactory>();

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", builder =>
                {
                    builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
                });
            });

            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            app.UseDefaultFiles();
            app.UseStaticFiles();
            app.MapIdentityApi<AppUser>();

            app.MapPost("/logout", async (SignInManager<AppUser> signInManager) =>
            {

                await signInManager.SignOutAsync();
                return Results.Ok();

            }).RequireAuthorization();


            app.MapGet("/pingauth", (ClaimsPrincipal user) =>
            {
                var email = user.FindFirstValue(ClaimTypes.Email); // get the user's email from the claim
                return Results.Json(new { Email = email }); ; // return the email as a plain text response
            }).RequireAuthorization();


            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthentication();
            app.UseAuthorization();


            app.MapControllers();

            app.MapFallbackToFile("/index.html");

            using (var scope = app.Services.CreateScope())
            {
                var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

                var roles = new[] { "Student", "Teacher" }; 

                foreach(var role in roles)
                {
                    if (!await roleManager.RoleExistsAsync(role))
                        await roleManager.CreateAsync(new IdentityRole(role));
                }
            }

            app.Run();
        }
    }
}
