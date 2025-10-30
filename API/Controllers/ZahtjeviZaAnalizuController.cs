using System.Security.Claims;
using API.Data;
using API.DTO;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ZahtjevZaAnalizuController(DomZdravljaContext context) : ControllerBase
{
    // ✅ Doktor kreira zahtjev za određenog pacijenta
    [HttpPost("pacijent/{pacijentId}")]
    public async Task<IActionResult> KreirajZahtjev(int pacijentId, [FromBody] KreirajZahtjevAnalizuDto dto)
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

        var zahtjev = new ZahtjevZaAnalizu
        {
            PacijentId = pacijent.Id,
            Pacijent = pacijent,
            DoktorId = korisnik.Doktor.Id,
            Doktor = korisnik.Doktor,
            Opis = dto.Opis,
            Status = "Na čekanju",
            DatumZahtjeva = DateTime.Now
        };

        context.ZahtjeviZaAnalizu.Add(zahtjev);
        await context.SaveChangesAsync();

        return Ok(new { message = "Zahtjev uspješno kreiran." });
    }

    // ✅ Doktor vidi sve zahtjeve koje je on kreirao
    [HttpGet("doktor")]
    public async Task<ActionResult<IEnumerable<ZahtjevZaAnalizuDto>>> GetZahtjeviDoktora()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim == null) return Unauthorized();

        var userId = Guid.Parse(userIdClaim);
        var korisnik = await context.Korisnici
            .Include(k => k.Doktor)
            .FirstOrDefaultAsync(k => k.Id == userId);

        if (korisnik?.Doktor == null)
            return BadRequest("Prijavljeni korisnik nije doktor.");

        var zahtjevi = await context.ZahtjeviZaAnalizu
            .Include(z => z.Pacijent)
            .Include(z => z.Tehnicar)
            .Where(z => z.DoktorId == korisnik.Doktor.Id)
            .Select(z => new ZahtjevZaAnalizuDto
            {
                Id = z.Id,
                PacijentId = z.PacijentId,
                PacijentIme = z.Pacijent.Ime,
                PacijentPrezime = z.Pacijent.Prezime,
                DoktorId = z.DoktorId,
                DoktorIme = korisnik.Doktor.Ime,
                DoktorPrezime = korisnik.Doktor.Prezime,
                TehnicarId = z.TehnicarId,
                TehnicarIme = z.Tehnicar != null ? z.Tehnicar.Ime : null,
                TehnicarPrezime = z.Tehnicar != null ? z.Tehnicar.Prezime : null,
                Opis = z.Opis,
                Status = z.Status,
                DatumZahtjeva = z.DatumZahtjeva
            })
            .ToListAsync();

        return Ok(zahtjevi);
    }

    // ✅ Doktor vidi zahtjeve određenog pacijenta
    [HttpGet("pacijent/{pacijentId}")]
    public async Task<ActionResult<IEnumerable<ZahtjevZaAnalizuDto>>> GetZahtjeviPacijenta(int pacijentId)
    {
        var zahtjevi = await context.ZahtjeviZaAnalizu
            .Include(z => z.Doktor)
            .Include(z => z.Tehnicar)
            .Include(z => z.Pacijent)
            .Where(z => z.PacijentId == pacijentId)
            .Select(z => new ZahtjevZaAnalizuDto
            {
                Id = z.Id,
                PacijentId = z.PacijentId,
                PacijentIme = z.Pacijent.Ime,
                PacijentPrezime = z.Pacijent.Prezime,
                DoktorId = z.DoktorId,
                DoktorIme = z.Doktor.Ime,
                DoktorPrezime = z.Doktor.Prezime,
                TehnicarId = z.TehnicarId,
                TehnicarIme = z.Tehnicar != null ? z.Tehnicar.Ime : null,
                TehnicarPrezime = z.Tehnicar != null ? z.Tehnicar.Prezime : null,
                Opis = z.Opis,
                Status = z.Status,
                DatumZahtjeva = z.DatumZahtjeva
            })
            .ToListAsync();

        return Ok(zahtjevi);
    }

    [HttpGet("na-cekanju")]
    public async Task<ActionResult<List<ZahtjevZaAnalizuDto>>> GetZahtjeviNaCekanju()
    {
        var zahtjevi = await context.ZahtjeviZaAnalizu
            .Where(z => z.Status == "Na čekanju")
            .Include(z => z.Pacijent)
            .Include(z => z.Doktor)
            .Include(z => z.Tehnicar)
            .Select(z => new ZahtjevZaAnalizuDto
            {
                Id = z.Id,
                PacijentId = z.PacijentId,
                PacijentIme = z.Pacijent.Ime,
                PacijentPrezime = z.Pacijent.Prezime,
                DoktorId = z.DoktorId,
                DoktorIme = z.Doktor.Ime,
                DoktorPrezime = z.Doktor.Prezime,
                TehnicarId = z.TehnicarId,
                TehnicarIme = z.Tehnicar != null ? z.Tehnicar.Ime : null,
                TehnicarPrezime = z.Tehnicar != null ? z.Tehnicar.Prezime : null,
                Opis = z.Opis,
                Status = z.Status,
                DatumZahtjeva = z.DatumZahtjeva
            })
            .ToListAsync();

        return Ok(zahtjevi);
    }

    public class PromjenaStatusaDto
    {
        public string? Status { get; set; }
    }

    // ✅ Tehničar mijenja status zahtjeva
    [HttpPut("{id}/status")]
    public async Task<IActionResult> PromijeniStatus(int id, [FromBody] PromjenaStatusaDto status)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim == null) return Unauthorized();

        var userId = Guid.Parse(userIdClaim);
        var korisnik = await context.Korisnici
            .Include(k => k.Tehnicar)
            .FirstOrDefaultAsync(k => k.Id == userId);

        if (korisnik?.Tehnicar == null)
            return BadRequest("Prijavljeni korisnik nije tehničar.");

        var zahtjev = await context.ZahtjeviZaAnalizu
            .Include(z => z.Pacijent)
            .FirstOrDefaultAsync(z => z.Id == id);

        if (zahtjev == null)
            return NotFound("Zahtjev nije pronađen.");

        var noviStatus = status;

        if (noviStatus.Status != "U obradi" && noviStatus.Status != "Obrađen" && noviStatus.Status != "Odbijen")
            return BadRequest("Nevažeći status.");

        // ✅ Ako zahtjev nema tehničara, dodaj trenutnog tehničara iz tokena
        if (zahtjev.TehnicarId == null)
        {
            zahtjev.TehnicarId = korisnik.Tehnicar.Id;
            zahtjev.Tehnicar = korisnik.Tehnicar;
        }

        zahtjev.Status = noviStatus.Status;

        await context.SaveChangesAsync();
        return Ok(new { message = $"Status zahtjeva promijenjen u '{noviStatus}'." });
    }


    [HttpPost("{zahtjevId}/zavrsi")]
    public async Task<IActionResult> ZavrsiObraduZahtjeva(int zahtjevId, IFormFile file)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim == null) return Unauthorized();

        var userId = Guid.Parse(userIdClaim);
        var korisnik = await context.Korisnici
            .Include(k => k.Tehnicar)
            .FirstOrDefaultAsync(k => k.Id == userId);

        if (korisnik?.Tehnicar == null)
            return BadRequest("Prijavljeni korisnik nije tehničar.");

        var zahtjev = await context.ZahtjeviZaAnalizu
            .Include(z => z.Pacijent)
            .FirstOrDefaultAsync(z => z.Id == zahtjevId);

        if (zahtjev == null)
            return NotFound("Zahtjev nije pronađen.");

        if (file == null || file.Length == 0)
            return BadRequest("PDF fajl nije poslat.");

        // ✅ Dodaj tehničara ako nije već upisan
        if (zahtjev.TehnicarId == null)
        {
            zahtjev.TehnicarId = korisnik.Tehnicar.Id;
            zahtjev.Tehnicar = korisnik.Tehnicar;
        }

        // Kreiraj folder ako ne postoji
        var folderPath = Path.Combine("wwwroot", "uploads", "nalazi");
        if (!Directory.Exists(folderPath))
            Directory.CreateDirectory(folderPath);

        var fileName = $"nalaz_{zahtjev.Id}_{DateTime.Now:yyyyMMddHHmmss}.pdf";
        var filePath = Path.Combine(folderPath, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        var nalaz = new Nalaz
        {
            ZahtjevZaAnalizuId = zahtjev.Id,
            ZahtjevZaAnalizu = zahtjev,
            PacijentId = zahtjev.PacijentId,
            Pacijent = zahtjev.Pacijent,
            TehnicarId = zahtjev.TehnicarId,
            Tehnicar = zahtjev.Tehnicar,
            FilePath = $"uploads/nalazi/{fileName}",
            DatumDodavanja = DateTime.Now
        };

        context.Nalazi.Add(nalaz);
        zahtjev.Status = "Obrađen";

        await context.SaveChangesAsync();

        return Ok(new
        {
            message = "Nalaz uspješno dodan i zahtjev završen.",
            zahtjevId = zahtjev.Id,
            nalazFilePath = nalaz.FilePath
        });
    }

    // ✅ Vraća sve zahtjeve za analizu (za administraciju ili pregled svih podataka)
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ZahtjevZaAnalizuDto>>> GetAllZahtjevi()
    {
        var zahtjevi = await context.ZahtjeviZaAnalizu
            .Include(z => z.Pacijent)
            .Include(z => z.Doktor)
            .Include(z => z.Tehnicar)
            .Select(z => new ZahtjevZaAnalizuDto
            {
                Id = z.Id,
                PacijentId = z.PacijentId,
                PacijentIme = z.Pacijent.Ime,
                PacijentPrezime = z.Pacijent.Prezime,
                DoktorId = z.DoktorId,
                DoktorIme = z.Doktor.Ime,
                DoktorPrezime = z.Doktor.Prezime,
                TehnicarId = z.TehnicarId,
                TehnicarIme = z.Tehnicar != null ? z.Tehnicar.Ime : null,
                TehnicarPrezime = z.Tehnicar != null ? z.Tehnicar.Prezime : null,
                Opis = z.Opis,
                Status = z.Status,
                DatumZahtjeva = z.DatumZahtjeva
            })
            .ToListAsync();

        return Ok(zahtjevi);
    }


}
