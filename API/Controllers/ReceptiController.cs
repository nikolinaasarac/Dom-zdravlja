using System.Security.Claims;
using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace API.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  [Authorize]
  public class ReceptiController(DomZdravljaContext context) : ControllerBase
  {

    // ✅ Dohvati sve recepte za pacijenta
    [HttpGet("{pacijentId}")]
    public async Task<ActionResult<List<Recept>>> GetReceptiZaPacijenta(int pacijentId)
    {
      var recepti = await context.Recepti
          .Where(r => r.PacijentId == pacijentId)
          .Include(r => r.Pacijent)
          .Include(r => r.Doktor)
          .ToListAsync();

      if (recepti == null || !recepti.Any())
        return NotFound("Nema recepata za ovog pacijenta.");

      return Ok(recepti);
    }

    // ✅ Kreiraj novi recept
    [HttpPost("{pacijentId}")]
    public async Task<ActionResult<Recept>> CreateRecept(int pacijentId, [FromBody] ReceptDto dto)
    {
      var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
      if (userIdClaim == null) return Unauthorized();

      var userId = Guid.Parse(userIdClaim);
      var korisnik = await context.Korisnici
          .Include(k => k.Doktor)
          .FirstOrDefaultAsync(k => k.Id == userId);

      if (korisnik?.Doktor == null) return BadRequest("Prijavljeni korisnik nije doktor.");

      var pacijent = await context.Pacijenti.FindAsync(pacijentId);
      if (pacijent == null) return NotFound("Pacijent nije pronađen.");

      var recept = new Recept
      {
        PacijentId = pacijentId,
        Pacijent = pacijent,
        DoktorId = korisnik.Doktor.Id,
        Doktor = korisnik.Doktor,
        NazivLijeka = dto.NazivLijeka,
        Kolicina = dto.Kolicina,
        NacinUzimanja = dto.NacinUzimanja,
        Napomena = dto.Napomena,
        DatumIzdavanja = DateTime.Now
      };

      context.Recepti.Add(recept);
      await context.SaveChangesAsync();

      return Ok(recept);
    }

    // ✅ Generiši PDF recepta pomoću QuestPDF
    [Authorize]
    [HttpGet("{id}/pdf")]
    public async Task<IActionResult> GetReceptPdf(int id)
    {
      var recept = await context.Recepti
          .Include(r => r.Pacijent)
          .Include(r => r.Doktor)
          .FirstOrDefaultAsync(r => r.Id == id);

      if (recept == null)
        return NotFound("Recept nije pronađen.");

      var pdfBytes = Document.Create(container =>
      {
        container.Page(page =>
              {
            page.Size(PageSizes.A4);
            page.Margin(30);

            page.Content().Column(col =>
                  {
                col.Item().Text("LJEKARSKI RECEPT").FontSize(20).Bold().AlignCenter();
                col.Item().LineHorizontal(1).LineColor(Colors.Black);
                col.Item().Text($"Datum izdavanja: {recept.DatumIzdavanja:dd.MM.yyyy.}");
                col.Item().Text("\n");

                col.Item().Text("Pacijent:").FontSize(14).Bold();
                col.Item().Text($"{recept.Pacijent.Ime} {recept.Pacijent.Prezime}");
                col.Item().Text($"Datum rođenja: {recept.Pacijent.DatumRodjenja:dd.MM.yyyy.}");
                col.Item().Text($"Pol: {recept.Pacijent.Pol}");
                col.Item().Text($"Adresa: {recept.Pacijent.Adresa}");
                col.Item().Text("\n");

                col.Item().Text("Doktor:").FontSize(14).Bold();
                col.Item().Text($"{recept.Doktor.Ime} {recept.Doktor.Prezime}");
                col.Item().Text($"Šifra: {recept.Doktor.Id}");
                col.Item().Text("\n");

                col.Item().Text("Propisani lijek:").FontSize(14).Bold();
                col.Item().Text($"Naziv: {recept.NazivLijeka}");
                col.Item().Text($"Količina: {recept.Kolicina}");
                col.Item().Text($"Način uzimanja: {recept.NacinUzimanja}");

                if (!string.IsNullOrEmpty(recept.Napomena))
                {
                  col.Item().Text("\nNapomena:").FontSize(14).Bold();
                  col.Item().Text(recept.Napomena);
                }

                col.Item().Text("\n--------------------------------------------------");
                col.Item().Text($"Potpis ljekara: {recept.Doktor.Ime} {recept.Doktor.Prezime}");
              });
          });
      }).GeneratePdf();

      return File(pdfBytes, "application/pdf", $"recept_{id}.pdf");
    }
  }
}
