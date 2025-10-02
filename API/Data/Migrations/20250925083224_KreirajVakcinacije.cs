using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class KreirajVakcinacije : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Vakcinacije",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    PacijentId = table.Column<int>(type: "INTEGER", nullable: false),
                    NazivVakcine = table.Column<string>(type: "TEXT", nullable: false),
                    DatumPrimanja = table.Column<DateOnly>(type: "TEXT", nullable: false),
                    Doza = table.Column<int>(type: "INTEGER", nullable: false),
                    Napomena = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vakcinacije", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Vakcinacije_Pacijenti_PacijentId",
                        column: x => x.PacijentId,
                        principalTable: "Pacijenti",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Vakcinacije_PacijentId",
                table: "Vakcinacije",
                column: "PacijentId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Vakcinacije");
        }
    }
}
