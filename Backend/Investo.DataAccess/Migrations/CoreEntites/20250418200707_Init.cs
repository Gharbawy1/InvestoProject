using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Investo.DataAccess.Migrations.CoreEntites
{
    /// <inheritdoc />
    public partial class Init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "CoreEntities");

            migrationBuilder.CreateTable(
                name: "AspNetRoles",
                schema: "CoreEntities",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUsers",
                schema: "CoreEntities",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    RegistrationDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ProfilePictureURL = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Bio = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: true),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    Email = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedEmail = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SecurityStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    TwoFactorEnabled = table.Column<bool>(type: "bit", nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    LockoutEnabled = table.Column<bool>(type: "bit", nullable: false),
                    AccessFailedCount = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUsers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Categories",
                schema: "CoreEntities",
                columns: table => new
                {
                    Id = table.Column<byte>(type: "tinyint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    ProjectId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoleClaims",
                schema: "CoreEntities",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetRoleClaims_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalSchema: "CoreEntities",
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserClaims",
                schema: "CoreEntities",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetUserClaims_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalSchema: "CoreEntities",
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserLogins",
                schema: "CoreEntities",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProviderKey = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProviderDisplayName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserLogins", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_AspNetUserLogins_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalSchema: "CoreEntities",
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserRoles",
                schema: "CoreEntities",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    RoleId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalSchema: "CoreEntities",
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalSchema: "CoreEntities",
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserTokens",
                schema: "CoreEntities",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    LoginProvider = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Value = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_AspNetUserTokens_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalSchema: "CoreEntities",
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BusinessOwners",
                schema: "CoreEntities",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    PersonInfo_FullLegalName = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    PersonInfo_DateOfBirth = table.Column<DateTime>(type: "datetime2", nullable: false),
                    PersonInfo_NationalIDImageFrontURL = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PersonInfo_NationalIDImageBackURL = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PersonInfo_NationalIDL = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PassportDocument = table.Column<byte[]>(type: "varbinary(max)", nullable: false),
                    NationalIDDocument = table.Column<byte[]>(type: "varbinary(max)", nullable: false),
                    LastActivity = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ProjectId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BusinessOwners", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BusinessOwners_AspNetUsers_Id",
                        column: x => x.Id,
                        principalSchema: "CoreEntities",
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Investors",
                schema: "CoreEntities",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    RiskTolerance = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    InvestmentGoals = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PersonInfo_FullLegalName = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    PersonInfo_DateOfBirth = table.Column<DateTime>(type: "datetime2", nullable: false),
                    PersonInfo_NationalIDImageFrontURL = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PersonInfo_NationalIDImageBackURL = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PersonInfo_NationalIDL = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MinInvestmentAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    MaxInvestmentAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    AccreditationStatus = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NetWorth = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    AnnualIncome = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Investors", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Investors_AspNetUsers_Id",
                        column: x => x.Id,
                        principalSchema: "CoreEntities",
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Projects",
                schema: "CoreEntities",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProjectTitle = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Subtitle = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    ProjectLocation = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    ProjectImageURL = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FundingGoal = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    FundingExchange = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ProjectVision = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ProjectStory = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CurrentVision = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Goals = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CategoryId = table.Column<byte>(type: "tinyint", nullable: false),
                    OwnerId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Projects", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Projects_BusinessOwners_OwnerId",
                        column: x => x.OwnerId,
                        principalSchema: "CoreEntities",
                        principalTable: "BusinessOwners",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Projects_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalSchema: "CoreEntities",
                        principalTable: "Categories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Offers",
                schema: "CoreEntities",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OfferAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    EquityPercentage = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ProfitShare = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    InvestmentType = table.Column<int>(type: "int", nullable: false),
                    OfferTerms = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: false),
                    AdditionalServices = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    Status = table.Column<int>(type: "int", nullable: false),
                    OfferDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ExpirationDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    InvestorId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    ProjectId = table.Column<int>(type: "int", nullable: false),
                    BusinessOwnerId = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Offers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Offers_BusinessOwners_BusinessOwnerId",
                        column: x => x.BusinessOwnerId,
                        principalSchema: "CoreEntities",
                        principalTable: "BusinessOwners",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Offers_Investors_InvestorId",
                        column: x => x.InvestorId,
                        principalSchema: "CoreEntities",
                        principalTable: "Investors",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Offers_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalSchema: "CoreEntities",
                        principalTable: "Projects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AspNetRoleClaims_RoleId",
                schema: "CoreEntities",
                table: "AspNetRoleClaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                schema: "CoreEntities",
                table: "AspNetRoles",
                column: "NormalizedName",
                unique: true,
                filter: "[NormalizedName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserClaims_UserId",
                schema: "CoreEntities",
                table: "AspNetUserClaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserLogins_UserId",
                schema: "CoreEntities",
                table: "AspNetUserLogins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserRoles_RoleId",
                schema: "CoreEntities",
                table: "AspNetUserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                schema: "CoreEntities",
                table: "AspNetUsers",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                schema: "CoreEntities",
                table: "AspNetUsers",
                column: "NormalizedUserName",
                unique: true,
                filter: "[NormalizedUserName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Offers_BusinessOwnerId",
                schema: "CoreEntities",
                table: "Offers",
                column: "BusinessOwnerId");

            migrationBuilder.CreateIndex(
                name: "IX_Offers_InvestorId",
                schema: "CoreEntities",
                table: "Offers",
                column: "InvestorId");

            migrationBuilder.CreateIndex(
                name: "IX_Offers_ProjectId",
                schema: "CoreEntities",
                table: "Offers",
                column: "ProjectId");

            migrationBuilder.CreateIndex(
                name: "IX_Projects_CategoryId",
                schema: "CoreEntities",
                table: "Projects",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Projects_OwnerId",
                schema: "CoreEntities",
                table: "Projects",
                column: "OwnerId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AspNetRoleClaims",
                schema: "CoreEntities");

            migrationBuilder.DropTable(
                name: "AspNetUserClaims",
                schema: "CoreEntities");

            migrationBuilder.DropTable(
                name: "AspNetUserLogins",
                schema: "CoreEntities");

            migrationBuilder.DropTable(
                name: "AspNetUserRoles",
                schema: "CoreEntities");

            migrationBuilder.DropTable(
                name: "AspNetUserTokens",
                schema: "CoreEntities");

            migrationBuilder.DropTable(
                name: "Offers",
                schema: "CoreEntities");

            migrationBuilder.DropTable(
                name: "AspNetRoles",
                schema: "CoreEntities");

            migrationBuilder.DropTable(
                name: "Investors",
                schema: "CoreEntities");

            migrationBuilder.DropTable(
                name: "Projects",
                schema: "CoreEntities");

            migrationBuilder.DropTable(
                name: "BusinessOwners",
                schema: "CoreEntities");

            migrationBuilder.DropTable(
                name: "Categories",
                schema: "CoreEntities");

            migrationBuilder.DropTable(
                name: "AspNetUsers",
                schema: "CoreEntities");
        }
    }
}
