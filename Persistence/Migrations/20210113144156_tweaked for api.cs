using Microsoft.EntityFrameworkCore.Migrations;

namespace Persistence.Migrations
{
    public partial class tweakedforapi : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "DatePosted",
                table: "UserJobs",
                newName: "DateJoined");

            migrationBuilder.RenameColumn(
                name: "DatePosted",
                table: "UserExperiences",
                newName: "DateJoined");

            migrationBuilder.RenameColumn(
                name: "DatePublished",
                table: "UserBlogs",
                newName: "DateJoined");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "DateJoined",
                table: "UserJobs",
                newName: "DatePosted");

            migrationBuilder.RenameColumn(
                name: "DateJoined",
                table: "UserExperiences",
                newName: "DatePosted");

            migrationBuilder.RenameColumn(
                name: "DateJoined",
                table: "UserBlogs",
                newName: "DatePublished");
        }
    }
}
