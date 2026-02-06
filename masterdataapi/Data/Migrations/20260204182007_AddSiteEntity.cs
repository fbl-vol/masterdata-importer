using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace masterdata_api.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddSiteEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SiteId",
                table: "WindTurbines",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Sites",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    SfEjendomsNr = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sites", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_WindTurbines_SiteId",
                table: "WindTurbines",
                column: "SiteId");

            migrationBuilder.CreateIndex(
                name: "IX_Sites_SfEjendomsNr",
                table: "Sites",
                column: "SfEjendomsNr");

            migrationBuilder.AddForeignKey(
                name: "FK_WindTurbines_Sites_SiteId",
                table: "WindTurbines",
                column: "SiteId",
                principalTable: "Sites",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_WindTurbines_Sites_SiteId",
                table: "WindTurbines");

            migrationBuilder.DropTable(
                name: "Sites");

            migrationBuilder.DropIndex(
                name: "IX_WindTurbines_SiteId",
                table: "WindTurbines");

            migrationBuilder.DropColumn(
                name: "SiteId",
                table: "WindTurbines");
        }
    }
}
