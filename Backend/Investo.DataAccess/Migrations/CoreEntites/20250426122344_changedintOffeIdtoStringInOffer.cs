using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Investo.DataAccess.Migrations.CoreEntites
{
    /// <inheritdoc />
    public partial class changedintOffeIdtoStringInOffer : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Offers_Investors_InvestorId",
                schema: "CoreEntities",
                table: "Offers");

            migrationBuilder.DropIndex(
                name: "IX_Offers_InvestorId",
                schema: "CoreEntities",
                table: "Offers");

            //migrationBuilder.DropColumn(
            //    name: "InvestorId",
            //    schema: "CoreEntities",
            //    table: "Offers");

            migrationBuilder.AlterColumn<decimal>(
                name: "ProfitShare",
                schema: "CoreEntities",
                table: "Offers",
                type: "decimal(18,2)",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.AlterColumn<string>(
                name: "InvestorId",
                schema: "CoreEntities",
                table: "Offers",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<decimal>(
                name: "EquityPercentage",
                schema: "CoreEntities",
                table: "Offers",
                type: "decimal(18,2)",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.CreateIndex(
                name: "IX_Offers_InvestorId",
                schema: "CoreEntities",
                table: "Offers",
                column: "InvestorId");

            migrationBuilder.AddForeignKey(
                name: "FK_Offers_Investors_InvestorId",
                schema: "CoreEntities",
                table: "Offers",
                column: "InvestorId",
                principalSchema: "CoreEntities",
                principalTable: "Investors",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Offers_Investors_InvestorId",
                schema: "CoreEntities",
                table: "Offers");

            migrationBuilder.DropIndex(
                name: "IX_Offers_InvestorId",
                schema: "CoreEntities",
                table: "Offers");

            migrationBuilder.AlterColumn<decimal>(
                name: "ProfitShare",
                schema: "CoreEntities",
                table: "Offers",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "InvestorId",
                schema: "CoreEntities",
                table: "Offers",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<decimal>(
                name: "EquityPercentage",
                schema: "CoreEntities",
                table: "Offers",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "InvestorId",
                schema: "CoreEntities",
                table: "Offers",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Offers_InvestorId",
                schema: "CoreEntities",
                table: "Offers",
                column: "InvestorId");

            migrationBuilder.AddForeignKey(
                name: "FK_Offers_Investors_InvestorId",
                schema: "CoreEntities",
                table: "Offers",
                column: "InvestorId",
                principalSchema: "CoreEntities",
                principalTable: "Investors",
                principalColumn: "Id");
        }
    }
}
