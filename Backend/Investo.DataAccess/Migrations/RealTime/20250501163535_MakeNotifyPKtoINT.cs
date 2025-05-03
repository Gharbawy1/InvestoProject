using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Investo.DataAccess.Migrations.RealTime
{
    /// <inheritdoc />
    public partial class MakeNotifyPKtoINT : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
               name: "PK_Notifications",
               schema: "RealTime",
               table: "Notifications");

            migrationBuilder.DropColumn(
                name: "Id",
                schema: "RealTime",
                table: "Notifications");

            migrationBuilder.AddColumn<int>(
                name: "Id",
                schema: "RealTime",
                table: "Notifications",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Notifications",
                schema: "RealTime",
                table: "Notifications",
                column: "Id");

            migrationBuilder.AddColumn<string>(
                name: "IssuerId",
                schema: "RealTime",
                table: "Notifications",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IssuerId",
                schema: "RealTime",
                table: "Notifications");

            migrationBuilder.AlterColumn<string>(
                name: "Id",
                schema: "RealTime",
                table: "Notifications",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int")
                .OldAnnotation("SqlServer:Identity", "1, 1");
        }
    }
}
