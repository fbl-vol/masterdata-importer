using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace masterdata_api.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "WindTurbines",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Gsrn = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    OriginalConnectionDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    DecommissioningDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CapacityKw = table.Column<int>(type: "integer", nullable: true),
                    RotorDiameterM = table.Column<decimal>(type: "numeric(10,2)", nullable: true),
                    HubHeightM = table.Column<decimal>(type: "numeric(10,2)", nullable: true),
                    Manufacturer = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    TypeDesignation = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    LocalAuthority = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    LocationType = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    CadastralDistrict = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    CadastralNo = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    CoordinateX = table.Column<decimal>(type: "numeric(12,2)", nullable: true),
                    CoordinateY = table.Column<decimal>(type: "numeric(12,2)", nullable: true),
                    CoordinateOrigin = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WindTurbines", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_WindTurbines_Gsrn",
                table: "WindTurbines",
                column: "Gsrn",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "WindTurbines");
        }
    }
}
