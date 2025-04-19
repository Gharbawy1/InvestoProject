using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Investo.DataAccess.Migrations.CoreEntites
{
    /// <inheritdoc />
    public partial class Chng_BusinessOwnerPassport_NationIDtoString : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NationalIDDocument",
                schema: "CoreEntities",
                table: "BusinessOwners");

            migrationBuilder.DropColumn(
                name: "PassportDocument",
                schema: "CoreEntities",
                table: "BusinessOwners");

            migrationBuilder.AddColumn<string>(
                name: "NationalIDDocumentURL",
                schema: "CoreEntities",
                table: "BusinessOwners",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PassportDocumentURL",
                schema: "CoreEntities",
                table: "BusinessOwners",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NationalIDDocumentURL",
                schema: "CoreEntities",
                table: "BusinessOwners");

            migrationBuilder.DropColumn(
                name: "PassportDocumentURL",
                schema: "CoreEntities",
                table: "BusinessOwners");

            migrationBuilder.AddColumn<byte[]>(
                name: "NationalIDDocument",
                schema: "CoreEntities",
                table: "BusinessOwners",
                type: "varbinary(max)",
                nullable: false,
                defaultValue: new byte[0]);

            migrationBuilder.AddColumn<byte[]>(
                name: "PassportDocument",
                schema: "CoreEntities",
                table: "BusinessOwners",
                type: "varbinary(max)",
                nullable: false,
                defaultValue: new byte[0]);
        }
    }
}
