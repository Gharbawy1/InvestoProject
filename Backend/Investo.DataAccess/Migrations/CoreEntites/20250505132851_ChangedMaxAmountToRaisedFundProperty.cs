using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Investo.DataAccess.Migrations.CoreEntites
{
    /// <inheritdoc />
    public partial class ChangedMaxAmountToRaisedFundProperty : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "MaxOfferAmount",
                schema: "CoreEntities",
                table: "Projects",
                newName: "RaisedFund");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "RaisedFund",
                schema: "CoreEntities",
                table: "Projects",
                newName: "MaxOfferAmount");
        }
    }
}
