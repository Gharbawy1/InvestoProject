using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Investo.DataAccess.Migrations.CoreEntites
{
    /// <inheritdoc />
    public partial class AddIsPaidToOfferModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsPaid",
                schema: "CoreEntities",
                table: "Offers",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsPaid",
                schema: "CoreEntities",
                table: "Offers");
        }
    }
}
