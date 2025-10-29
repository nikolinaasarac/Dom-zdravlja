using System.Security.Claims;
using API.Data;
using API.DTO;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ZahtjevZaAnalizuController(DomZdravljaContext context) : ControllerBase
    {

        // POST: api/ZahtjevZaAnalizu/pacijent/{pacijentId}
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

            var result = new ZahtjevZaAnalizuDto
            {
                Id = zahtjev.Id,
                PacijentId = pacijent.Id,
                PacijentIme = pacijent.Ime,
                PacijentPrezime = pacijent.Prezime,
                DoktorId = korisnik.Doktor.Id,
                DoktorIme = korisnik.Doktor.Ime,
                DoktorPrezime = korisnik.Doktor.Prezime,
                TehnicarId = null,
                TehnicarIme = null,
                TehnicarPrezime = null,
                Opis = zahtjev.Opis,
                Status = zahtjev.Status,
                DatumZahtjeva = zahtjev.DatumZahtjeva
            };

            return Ok(result);
        }

        // GET: api/ZahtjevZaAnalizu
        [HttpGet]
        public async Task<ActionResult<List<ZahtjevZaAnalizuDto>>> GetAllZahtjevi()
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
}
