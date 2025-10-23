using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class ZahtjevZaPregledController(DomZdravljaContext context) : ControllerBase
  {

    // POST: api/ZahtjevZaPregled
    [HttpPost]
    public async Task<IActionResult> KreirajZahtjev(KreirajZahtjevDto dto)
    {
      var pacijent = await context.Pacijenti.FindAsync(dto.PacijentId);
      var doktor = await context.Doktori.FindAsync(dto.DoktorId);

      if (pacijent == null || doktor == null)
        return BadRequest("Neispravan ID pacijenta ili doktora.");

      var zahtjev = new ZahtjevZaPregled
      {
        PacijentId = dto.PacijentId,
        Pacijent = pacijent,
        DoktorId = dto.DoktorId,
        Doktor = doktor,
        Opis = dto.Opis,
        Status = "Na čekanju",
        DatumZahtjeva = DateTime.Now
      };

      context.ZahtjeviZaPregled.Add(zahtjev);
      await context.SaveChangesAsync();

      var result = new ZahtjevZaPregledDto
      {
        Id = zahtjev.Id,
        DatumZahtjeva = zahtjev.DatumZahtjeva,
        Opis = zahtjev.Opis,
        Status = zahtjev.Status,
        PacijentIme = pacijent.Ime,
        PacijentPrezime = pacijent.Prezime,
        DoktorIme = doktor.Ime,
        DoktorPrezime = doktor.Prezime
      };

      return Ok(result);
    }


    [HttpGet("doktor/{doktorId}")]
    public async Task<List<ZahtjevZaPregledDto>> GetZahtjeviZaDoktora(int doktorId)
    {
      var zahtjevi = await context.ZahtjeviZaPregled
          .Include(z => z.Pacijent)
          .Include(z => z.Doktor)
          .Where(z => z.DoktorId == doktorId)
          .Select(z => new ZahtjevZaPregledDto
          {
            Id = z.Id,
            DatumZahtjeva = z.DatumZahtjeva,
            Opis = z.Opis,
            Status = z.Status,
            PacijentIme = z.Pacijent.Ime,
            PacijentPrezime = z.Pacijent.Prezime,
            DoktorIme = z.Doktor.Ime,
            DoktorPrezime = z.Doktor.Prezime
          })
          .ToListAsync();

      return zahtjevi;
    }


    // PUT: api/ZahtjevZaPregled/odobri/10
    [HttpPut("odobri/{id}")]
    public async Task<IActionResult> PrihvatiZahtjev(int id, [FromBody] DateTime datumPregleda)
    {
      var zahtjev = await context.ZahtjeviZaPregled
          .Include(z => z.Pacijent)
          .Include(z => z.Doktor)
          .FirstOrDefaultAsync(z => z.Id == id);

      if (zahtjev == null)
        return NotFound("Zahtjev nije pronađen.");

      zahtjev.Status = "Prihvaćen";

      // Kreiramo novi pregled
      var pregled = new Pregled
      {
        DatumPregleda = datumPregleda,
        VrstaPregleda = "Opšti pregled",
        OpisSimptoma = zahtjev.Opis,
        PacijentId = zahtjev.PacijentId,
        DoktorId = zahtjev.DoktorId,
        ZahtjevZaPregledId = zahtjev.Id,
        Status = "zakazan"
      };

      context.Pregledi.Add(pregled);
      await context.SaveChangesAsync();

      return Ok(new { message = "Zahtjev prihvaćen i pregled zakazan."});
    }

    // PUT: api/ZahtjevZaPregled/odbij/10
    [HttpPut("odbij/{id}")]
    public async Task<IActionResult> OdbijZahtjev(int id)
    {
      var zahtjev = await context.ZahtjeviZaPregled.FindAsync(id);
      if (zahtjev == null) return NotFound();

      zahtjev.Status = "Odbijen";
      await context.SaveChangesAsync();

      return Ok(new { message = "Zahtjev odbijen." });
    }
  }
}
