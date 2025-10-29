using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Doktori",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Ime = table.Column<string>(type: "TEXT", nullable: false),
                    Prezime = table.Column<string>(type: "TEXT", nullable: false),
                    Specijalizacija = table.Column<string>(type: "TEXT", nullable: false),
                    BrojLicence = table.Column<string>(type: "TEXT", nullable: false),
                    Telefon = table.Column<string>(type: "TEXT", nullable: false),
                    Email = table.Column<string>(type: "TEXT", nullable: false),
                    Adresa = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Doktori", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Pacijenti",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Ime = table.Column<string>(type: "TEXT", nullable: false),
                    Prezime = table.Column<string>(type: "TEXT", nullable: false),
                    DatumRodjenja = table.Column<DateOnly>(type: "TEXT", nullable: false),
                    Pol = table.Column<string>(type: "TEXT", nullable: false),
                    Adresa = table.Column<string>(type: "TEXT", nullable: false),
                    Telefon = table.Column<string>(type: "TEXT", nullable: false),
                    MaticniBroj = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pacijenti", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Tehnicari",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Ime = table.Column<string>(type: "TEXT", nullable: false),
                    Prezime = table.Column<string>(type: "TEXT", nullable: false),
                    Telefon = table.Column<string>(type: "TEXT", nullable: false),
                    Email = table.Column<string>(type: "TEXT", nullable: false),
                    Adresa = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tehnicari", x => x.Id);
                });

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
                    Napomena = table.Column<string>(type: "TEXT", nullable: true)
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

            migrationBuilder.CreateTable(
                name: "ZahtjeviZaPregled",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    PacijentId = table.Column<int>(type: "INTEGER", nullable: false),
                    DoktorId = table.Column<int>(type: "INTEGER", nullable: false),
                    DatumZahtjeva = table.Column<DateTime>(type: "TEXT", nullable: false),
                    Opis = table.Column<string>(type: "TEXT", nullable: false),
                    Status = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ZahtjeviZaPregled", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ZahtjeviZaPregled_Doktori_DoktorId",
                        column: x => x.DoktorId,
                        principalTable: "Doktori",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ZahtjeviZaPregled_Pacijenti_PacijentId",
                        column: x => x.PacijentId,
                        principalTable: "Pacijenti",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Korisnici",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Username = table.Column<string>(type: "TEXT", nullable: false),
                    PasswordHash = table.Column<string>(type: "TEXT", nullable: false),
                    Role = table.Column<string>(type: "TEXT", nullable: false),
                    DoktorId = table.Column<int>(type: "INTEGER", nullable: true),
                    TehnicarId = table.Column<int>(type: "INTEGER", nullable: true),
                    PacijentId = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Korisnici", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Korisnici_Doktori_DoktorId",
                        column: x => x.DoktorId,
                        principalTable: "Doktori",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Korisnici_Pacijenti_PacijentId",
                        column: x => x.PacijentId,
                        principalTable: "Pacijenti",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Korisnici_Tehnicari_TehnicarId",
                        column: x => x.TehnicarId,
                        principalTable: "Tehnicari",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "ZahtjeviZaAnalizu",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    PacijentId = table.Column<int>(type: "INTEGER", nullable: false),
                    DoktorId = table.Column<int>(type: "INTEGER", nullable: false),
                    TehnicarId = table.Column<int>(type: "INTEGER", nullable: true),
                    DatumZahtjeva = table.Column<DateTime>(type: "TEXT", nullable: false),
                    Opis = table.Column<string>(type: "TEXT", nullable: false),
                    Status = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ZahtjeviZaAnalizu", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ZahtjeviZaAnalizu_Doktori_DoktorId",
                        column: x => x.DoktorId,
                        principalTable: "Doktori",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ZahtjeviZaAnalizu_Pacijenti_PacijentId",
                        column: x => x.PacijentId,
                        principalTable: "Pacijenti",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ZahtjeviZaAnalizu_Tehnicari_TehnicarId",
                        column: x => x.TehnicarId,
                        principalTable: "Tehnicari",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Pregledi",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    DatumPregleda = table.Column<DateTime>(type: "TEXT", nullable: false),
                    VrstaPregleda = table.Column<string>(type: "TEXT", nullable: false),
                    OpisSimptoma = table.Column<string>(type: "TEXT", nullable: true),
                    Dijagnoza = table.Column<string>(type: "TEXT", nullable: true),
                    Terapija = table.Column<string>(type: "TEXT", nullable: true),
                    Napomena = table.Column<string>(type: "TEXT", nullable: true),
                    Status = table.Column<string>(type: "TEXT", nullable: false),
                    PacijentId = table.Column<int>(type: "INTEGER", nullable: false),
                    DoktorId = table.Column<int>(type: "INTEGER", nullable: false),
                    ZahtjevZaPregledId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pregledi", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Pregledi_Doktori_DoktorId",
                        column: x => x.DoktorId,
                        principalTable: "Doktori",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Pregledi_Pacijenti_PacijentId",
                        column: x => x.PacijentId,
                        principalTable: "Pacijenti",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Pregledi_ZahtjeviZaPregled_ZahtjevZaPregledId",
                        column: x => x.ZahtjevZaPregledId,
                        principalTable: "ZahtjeviZaPregled",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RefreshTokens",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    KorisnikId = table.Column<Guid>(type: "TEXT", nullable: false),
                    Token = table.Column<string>(type: "TEXT", nullable: false),
                    ExpiresAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    Revoked = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RefreshTokens", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RefreshTokens_Korisnici_KorisnikId",
                        column: x => x.KorisnikId,
                        principalTable: "Korisnici",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Nalazi",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ZahtjevZaAnalizuId = table.Column<int>(type: "INTEGER", nullable: false),
                    PacijentId = table.Column<int>(type: "INTEGER", nullable: false),
                    TehnicarId = table.Column<int>(type: "INTEGER", nullable: true),
                    FilePath = table.Column<string>(type: "TEXT", nullable: true),
                    DatumDodavanja = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nalazi", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nalazi_Pacijenti_PacijentId",
                        column: x => x.PacijentId,
                        principalTable: "Pacijenti",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Nalazi_Tehnicari_TehnicarId",
                        column: x => x.TehnicarId,
                        principalTable: "Tehnicari",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Nalazi_ZahtjeviZaAnalizu_ZahtjevZaAnalizuId",
                        column: x => x.ZahtjevZaAnalizuId,
                        principalTable: "ZahtjeviZaAnalizu",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Korisnici_DoktorId",
                table: "Korisnici",
                column: "DoktorId");

            migrationBuilder.CreateIndex(
                name: "IX_Korisnici_PacijentId",
                table: "Korisnici",
                column: "PacijentId");

            migrationBuilder.CreateIndex(
                name: "IX_Korisnici_TehnicarId",
                table: "Korisnici",
                column: "TehnicarId");

            migrationBuilder.CreateIndex(
                name: "IX_Nalazi_PacijentId",
                table: "Nalazi",
                column: "PacijentId");

            migrationBuilder.CreateIndex(
                name: "IX_Nalazi_TehnicarId",
                table: "Nalazi",
                column: "TehnicarId");

            migrationBuilder.CreateIndex(
                name: "IX_Nalazi_ZahtjevZaAnalizuId",
                table: "Nalazi",
                column: "ZahtjevZaAnalizuId");

            migrationBuilder.CreateIndex(
                name: "IX_Pregledi_DoktorId",
                table: "Pregledi",
                column: "DoktorId");

            migrationBuilder.CreateIndex(
                name: "IX_Pregledi_PacijentId",
                table: "Pregledi",
                column: "PacijentId");

            migrationBuilder.CreateIndex(
                name: "IX_Pregledi_ZahtjevZaPregledId",
                table: "Pregledi",
                column: "ZahtjevZaPregledId");

            migrationBuilder.CreateIndex(
                name: "IX_RefreshTokens_KorisnikId",
                table: "RefreshTokens",
                column: "KorisnikId");

            migrationBuilder.CreateIndex(
                name: "IX_Uputnice_DoktorId",
                table: "Uputnice",
                column: "DoktorId");

            migrationBuilder.CreateIndex(
                name: "IX_Uputnice_PacijentId",
                table: "Uputnice",
                column: "PacijentId");

            migrationBuilder.CreateIndex(
                name: "IX_Vakcinacije_PacijentId",
                table: "Vakcinacije",
                column: "PacijentId");

            migrationBuilder.CreateIndex(
                name: "IX_ZahtjeviZaAnalizu_DoktorId",
                table: "ZahtjeviZaAnalizu",
                column: "DoktorId");

            migrationBuilder.CreateIndex(
                name: "IX_ZahtjeviZaAnalizu_PacijentId",
                table: "ZahtjeviZaAnalizu",
                column: "PacijentId");

            migrationBuilder.CreateIndex(
                name: "IX_ZahtjeviZaAnalizu_TehnicarId",
                table: "ZahtjeviZaAnalizu",
                column: "TehnicarId");

            migrationBuilder.CreateIndex(
                name: "IX_ZahtjeviZaPregled_DoktorId",
                table: "ZahtjeviZaPregled",
                column: "DoktorId");

            migrationBuilder.CreateIndex(
                name: "IX_ZahtjeviZaPregled_PacijentId",
                table: "ZahtjeviZaPregled",
                column: "PacijentId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Nalazi");

            migrationBuilder.DropTable(
                name: "Pregledi");

            migrationBuilder.DropTable(
                name: "RefreshTokens");

            migrationBuilder.DropTable(
                name: "Uputnice");

            migrationBuilder.DropTable(
                name: "Vakcinacije");

            migrationBuilder.DropTable(
                name: "ZahtjeviZaAnalizu");

            migrationBuilder.DropTable(
                name: "ZahtjeviZaPregled");

            migrationBuilder.DropTable(
                name: "Korisnici");

            migrationBuilder.DropTable(
                name: "Doktori");

            migrationBuilder.DropTable(
                name: "Pacijenti");

            migrationBuilder.DropTable(
                name: "Tehnicari");
        }
    }
}
