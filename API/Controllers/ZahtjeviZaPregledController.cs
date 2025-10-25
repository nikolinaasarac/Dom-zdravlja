using System.Security.Claims;
using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
  [Route("api/[controller]")]
  [ApiController]

  public class ZahtjevZaPregledController(DomZdravljaContext context) : ControllerBase
  {

    // POST: api/ZahtjevZaPregled
    [HttpPost]
    public async Task<IActionResult> KreirajZahtjev([FromBody] KreirajZahtjevDto dto)
    {
      // 1️⃣ Dohvati ID prijavljenog korisnika iz JWT tokena
      var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
      if (userIdClaim == null)
        return Unauthorized("Nije moguće prepoznati korisnika.");

      var userId = Guid.Parse(userIdClaim);

      // 2️⃣ Nađi korisnika i povezanog pacijenta
      var korisnik = await context.Korisnici
          .Include(k => k.Pacijent)
          .FirstOrDefaultAsync(k => k.Id == userId);

      if (korisnik?.Pacijent == null)
        return BadRequest("Prijavljeni korisnik nije pacijent.");

      var pacijent = korisnik.Pacijent;

      // 3️⃣ Nađi izabranog doktora
      var doktor = await context.Doktori.FindAsync(dto.DoktorId);
      if (doktor == null)
        return BadRequest("Neispravan ID doktora.");

      // 4️⃣ Kreiraj novi zahtjev
      var zahtjev = new ZahtjevZaPregled
      {
        PacijentId = pacijent.Id,
        Pacijent = pacijent,
        DoktorId = doktor.Id,
        Doktor = doktor,
        Opis = dto.Opis,
        Status = "Na čekanju",
        DatumZahtjeva = DateTime.Now
      };

      context.ZahtjeviZaPregled.Add(zahtjev);
      await context.SaveChangesAsync();

      // 5️⃣ Vrati DTO rezultat
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



    // GET: api/ZahtjevZaPregled/doktor
    [HttpGet("doktor")]
    public async Task<ActionResult<List<ZahtjevZaPregledDto>>> GetZahtjeviZaDoktora()
    {
      var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
      if (userIdClaim == null) return Unauthorized();

      var userId = Guid.Parse(userIdClaim);

      var korisnik = await context.Korisnici
          .Include(k => k.Doktor)
          .FirstOrDefaultAsync(k => k.Id == userId);

      if (korisnik?.Doktor == null)
        return BadRequest("Prijavljeni korisnik nije doktor.");

      var zahtjevi = await context.ZahtjeviZaPregled
          .Include(z => z.Pacijent)
          .Include(z => z.Doktor)
          .Where(z => z.DoktorId == korisnik.Doktor.Id)
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

      return Ok(zahtjevi);
    }

    [HttpGet("pacijent")]
    public async Task<ActionResult<List<ZahtjevZaPregledDto>>> GetZahtjeviZaPacijenta()
    {
      var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
      if (userIdClaim == null) return Unauthorized();

      var userId = Guid.Parse(userIdClaim);

      var korisnik = await context.Korisnici
          .Include(k => k.Pacijent)
          .FirstOrDefaultAsync(k => k.Id == userId);

      if (korisnik?.Pacijent == null)
        return BadRequest("Prijavljeni korisnik nije pacijent.");

      var zahtjevi = await context.ZahtjeviZaPregled
          .Include(z => z.Pacijent)
          .Include(z => z.Doktor)
          .Where(z => z.PacijentId == korisnik.Pacijent.Id)
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

      return Ok(zahtjevi);
    }

    [Authorize]
    [HttpGet("moji-zahtjevi")]
    public async Task<IActionResult> GetMojiZahtjevi()
    {
      // 1️⃣ Dohvati ID prijavljenog korisnika iz JWT tokena
      var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
      if (userIdClaim is null)
        return Unauthorized("Nije moguće prepoznati korisnika.");

      var userId = Guid.Parse(userIdClaim);

      // 2️⃣ Učitaj korisnika zajedno sa doktorom i pacijentom
      var korisnik = await context.Korisnici
          .Include(k => k.Doktor)
          .Include(k => k.Pacijent)
          .FirstOrDefaultAsync(k => k.Id == userId);

      if (korisnik == null)
        return Unauthorized("Korisnik nije pronađen.");

      // 3️⃣ Odredi filter za zahtjeve prema ulozi
      IQueryable<ZahtjevZaPregled> zahtjeviQuery = context.ZahtjeviZaPregled
          .Include(z => z.Pacijent)
          .Include(z => z.Doktor);

      if (korisnik.Doktor != null)
      {
        // Prijavljen doktor → zahtjevi koji su njemu upućeni
        zahtjeviQuery = zahtjeviQuery.Where(z => z.DoktorId == korisnik.Doktor.Id);
      }
      else if (korisnik.Pacijent != null)
      {
        // Prijavljen pacijent → zahtjevi koje je on poslao
        zahtjeviQuery = zahtjeviQuery.Where(z => z.PacijentId == korisnik.Pacijent.Id);
      }
      else
      {
        return BadRequest("Korisnik nema ulogu doktora niti pacijenta.");
      }

      // 4️⃣ Mapiranje na DTO
      var zahtjevi = await zahtjeviQuery
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

      return Ok(zahtjevi);
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

      return Ok(new { message = "Zahtjev prihvaćen i pregled zakazan." });
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

    [HttpGet]
    public async Task<List<ZahtjevZaPregledDto>> GetAllZahtjevi()
    {
      var zahtjevi = await context.ZahtjeviZaPregled
          .Include(z => z.Pacijent)
          .Include(z => z.Doktor)
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
  }
}
