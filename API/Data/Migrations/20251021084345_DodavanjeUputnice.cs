using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class DodavanjeUputnice : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Uputnice",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    PacijentId = table.Column<int>(type: "INTEGER", nullable: false),
                    DoktorId = table.Column<int>(type: "INTEGER", nullable: false),
                    Dijagnoza = table.Column<string>(type: "TEXT", nullable: false),
                    Opis = table.Column<string>(type: "TEXT", nullable: false),
                    UpucujeSe = table.Column<string>(type: "TEXT", nullable: false),
                    DatumIzdavanja = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Uputnice", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Uputnice_Doktori_DoktorId",
                        column: x => x.DoktorId,
                        principalTable: "Doktori",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Uputnice_Pacijenti_PacijentId",
                        column: x => x.PacijentId,
                        principalTable: "Pacijenti",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Uputnice_DoktorId",
                table: "Uputnice",
                column: "DoktorId");

            migrationBuilder.CreateIndex(
                name: "IX_Uputnice_PacijentId",
                table: "Uputnice",
                column: "PacijentId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Uputnice");
        }
    }
}
