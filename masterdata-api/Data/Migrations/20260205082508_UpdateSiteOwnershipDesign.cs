using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace masterdata_api.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateSiteOwnershipDesign : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Sites_SfEjendomsNr",
                table: "Sites");

            migrationBuilder.DropColumn(
                name: "SfEjendomsNr",
                table: "Sites");

            migrationBuilder.AddColumn<string>(
                name: "SfeEjendomsnr",
                table: "WindTurbines",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Sites_Name",
                table: "Sites",
                column: "Name");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Sites_Name",
                table: "Sites");

            migrationBuilder.DropColumn(
                name: "SfeEjendomsnr",
                table: "WindTurbines");

            migrationBuilder.AddColumn<string>(
                name: "SfEjendomsNr",
                table: "Sites",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Sites_SfEjendomsNr",
                table: "Sites",
                column: "SfEjendomsNr");
        }
    }
}
