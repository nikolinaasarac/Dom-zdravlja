using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace API.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class UputniceController(DomZdravljaContext context) : ControllerBase
  {
    // GET: api/uputnice/pacijent/{pacijentId}
    [HttpGet("{pacijentId}")]
    public async Task<ActionResult<List<Uputnica>>> GetUputniceZaPacijenta(int pacijentId)
    {
      var uputnice = await context.Uputnice
          .Where(u => u.PacijentId == pacijentId)
          .Include(u => u.Pacijent)
          .Include(u => u.Doktor)
          .ToListAsync();

      if (uputnice == null || uputnice.Count == 0)
        return NotFound("Nema uputnica za ovog pacijenta.");

      return Ok(uputnice);
    }


    // POST: api/uputnice/{pacijentId}
    [HttpPost("{pacijentId}")]
    public async Task<ActionResult<Uputnica>> CreateUputnica(int pacijentId, [FromBody] UputnicaDto dto)
    {
      var doktor = await context.Doktori.FindAsync(dto.DoktorId);
      var pacijent = await context.Pacijenti.FindAsync(pacijentId);

      if (pacijent == null) return NotFound("Pacijent nije pronađen");

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

      return Ok(uputnica);
    }

    // GET: api/uputnice/{id}/pdf
    [HttpGet("{id}/pdf")]
    public async Task<IActionResult> GetUputnicaPdf(int id)
    {
      var uputnica = await context.Uputnice
          .Include(u => u.Pacijent)
          .Include(u => u.Doktor)
          .FirstOrDefaultAsync(u => u.Id == id);

      if (uputnica == null) return NotFound();

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

      return File(pdfBytes, "application/pdf", $"uputnica_{uputnica.Id}.pdf");
    }
  }
}
