using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.EntityFrameworkCore;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace API.Services
{
    public class UputnicaService(DomZdravljaContext context) : IUputnicaService
    {
        public async Task<List<Uputnica>> GetUputniceZaPacijentaAsync(int pacijentId)
        {
            var uputnice = await context.Uputnice
                .Where(u => u.PacijentId == pacijentId)
                .Include(u => u.Pacijent)
                .Include(u => u.Doktor)
                .ToListAsync();

            return uputnice;
        }

        public async Task<Uputnica> CreateUputnicaAsync(int pacijentId, UputnicaDto dto)
        {
            var pacijent = await context.Pacijenti.FindAsync(pacijentId);
            if (pacijent == null) return null;

            var uputnica = new Uputnica
            {
                PacijentId = pacijentId,
                DoktorId = dto.DoktorId,
                Dijagnoza = dto.Dijagnoza,
                Opis = dto.Opis,
                UpucujeSe = dto.UpucujeSe,
                DatumIzdavanja = DateTime.Now
            };

            context.Uputnice.Add(uputnica);
            await context.SaveChangesAsync();

            return uputnica;
        }

        public async Task<byte[]> GeneratePdfAsync(int uputnicaId)
        {
            var uputnica = await context.Uputnice
                .Include(u => u.Pacijent)
                .Include(u => u.Doktor)
                .FirstOrDefaultAsync(u => u.Id == uputnicaId);

            if (uputnica == null) return null;

            var pdfBytes = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Margin(30);
                    page.Size(PageSizes.A4);

                    page.Content().Column(column =>
                    {
                        column.Item().Text("Uputnica").FontSize(20).Bold().AlignCenter();
                        column.Item().LineHorizontal(1).LineColor(Colors.Black);

                        column.Item().Text("\nPacijent:").FontSize(14).Bold();
                        column.Item().Text($"Ime i prezime: {uputnica.Pacijent.Ime} {uputnica.Pacijent.Prezime}");
                        column.Item().Text($"Datum rođenja: {uputnica.Pacijent.DatumRodjenja:dd.MM.yyyy}");
                        column.Item().Text($"Pol: {uputnica.Pacijent.Pol}");
                        column.Item().Text($"Matični broj: {uputnica.Pacijent.MaticniBroj}");
                        column.Item().Text($"Adresa: {uputnica.Pacijent.Adresa}");
                        column.Item().Text($"Telefon: {uputnica.Pacijent.Telefon}");

                        column.Item().Text("\nDoktor:").FontSize(14).Bold();
                        column.Item().Text($"Ime i prezime: {uputnica.Doktor.Ime} {uputnica.Doktor.Prezime}");
                        column.Item().Text($"Šifra: {uputnica.Doktor.Id}");

                        column.Item().Text("\nUputnica:").FontSize(14).Bold();
                        column.Item().Text($"Dijagnoza: {uputnica.Dijagnoza}");
                        column.Item().Text($"Opis: {uputnica.Opis}");
                        column.Item().Text($"Upućuje se: {uputnica.UpucujeSe}");
                        column.Item().Text($"Datum izdavanja: {uputnica.DatumIzdavanja:dd.MM.yyyy}");
                    });
                });
            }).GeneratePdf();

            return pdfBytes;
        }
    }
}
