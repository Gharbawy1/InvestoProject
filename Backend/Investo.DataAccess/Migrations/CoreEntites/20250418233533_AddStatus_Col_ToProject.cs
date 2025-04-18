using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Investo.DataAccess.Migrations.CoreEntites
{
    /// <inheritdoc />
    public partial class AddStatus_Col_ToProject : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Status",
                schema: "CoreEntities",
                table: "Projects",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Status",
                schema: "CoreEntities",
                table: "Projects");
        }
    }
}
