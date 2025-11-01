using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddZdravstvenaStanja : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ZdravstvenaStanja",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Naziv = table.Column<string>(type: "TEXT", nullable: false),
                    Tip = table.Column<string>(type: "TEXT", nullable: false),
                    DatumDijagnoze = table.Column<DateTime>(type: "TEXT", nullable: false),
                    Napomena = table.Column<string>(type: "TEXT", nullable: true),
                    PacijentId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ZdravstvenaStanja", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ZdravstvenaStanja_Pacijenti_PacijentId",
                        column: x => x.PacijentId,
                        principalTable: "Pacijenti",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ZdravstvenaStanja_PacijentId",
                table: "ZdravstvenaStanja",
                column: "PacijentId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ZdravstvenaStanja");
        }
    }
}
