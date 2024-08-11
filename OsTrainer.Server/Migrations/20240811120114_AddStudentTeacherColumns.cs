using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OsTrainer.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddStudentTeacherColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "StudentAssignment");

            migrationBuilder.DropTable(
                name: "Students");

            migrationBuilder.AddColumn<bool>(
                name: "IsStudent",
                table: "AspNetUsers",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsTeacher",
                table: "AspNetUsers",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "Assignments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AlgorithmType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ArrivalTimes = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BurstTimes = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StudentId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    TeacherId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Assignments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Assignments_AspNetUsers_StudentId",
                        column: x => x.StudentId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Assignments_AspNetUsers_TeacherId",
                        column: x => x.TeacherId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Assignments_StudentId",
                table: "Assignments",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_Assignments_TeacherId",
                table: "Assignments",
                column: "TeacherId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Assignments");

            migrationBuilder.DropColumn(
                name: "IsStudent",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "IsTeacher",
                table: "AspNetUsers");

            migrationBuilder.CreateTable(
                name: "Students",
                columns: table => new
                {
                    StudentId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Students", x => x.StudentId);
                    table.ForeignKey(
                        name: "FK_Students_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "StudentAssignment",
                columns: table => new
                {
                    StudentAssignmentId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AssignmentId = table.Column<int>(type: "int", nullable: false),
                    Grade = table.Column<int>(type: "int", nullable: true),
                    StudentId = table.Column<int>(type: "int", nullable: false),
                    StudentId1 = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StudentAssignment", x => x.StudentAssignmentId);
                    table.ForeignKey(
                        name: "FK_StudentAssignment_Students_StudentId1",
                        column: x => x.StudentId1,
                        principalTable: "Students",
                        principalColumn: "StudentId");
                });

            migrationBuilder.CreateIndex(
                name: "IX_StudentAssignment_StudentId1",
                table: "StudentAssignment",
                column: "StudentId1");

            migrationBuilder.CreateIndex(
                name: "IX_Students_UserId",
                table: "Students",
                column: "UserId");
        }
    }
}
