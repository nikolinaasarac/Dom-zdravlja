using System.Security.Claims;
using API.Data;
using API.DTO;
using API.Entities;
using API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PreglediController(IPregledService pregledService, DomZdravljaContext context) : ControllerBase
    {
        [HttpGet("{pacijentId}")]
        public async Task<ActionResult<List<PregledDto>>> GetPregledi(int pacijentId)
        {
            var pregledi = await pregledService.GetPreglediByPacijentIdAsync(pacijentId);
            return Ok(pregledi);
        }

        [HttpGet("doktor/pregledi")]
        public async Task<IActionResult> GetPreglediZaPrijavljenogDoktora()
        {
            // 1. Dohvati korisnički ID iz JWT tokena
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim is null) return Unauthorized();

            var userId = Guid.Parse(userIdClaim);

            // 2. Dohvati korisnika i njegovog doktora
            var korisnik = await context.Korisnici
                .Include(u => u.Doktor)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (korisnik?.Doktor == null)
                return BadRequest("Prijavljeni korisnik nije doktor.");

            var doktorId = korisnik.Doktor.Id;

            // 3. Dohvati preglede za doktora
            var pregledi = await context.Pregledi
                .Where(p => p.DoktorId == doktorId)
                .Include(p => p.Pacijent)
                .Select(p => new PregledDto
                {
                    Id = p.Id,
                    DatumPregleda = p.DatumPregleda,
                    VrstaPregleda = p.VrstaPregleda,
                    OpisSimptoma = p.OpisSimptoma,
                    Dijagnoza = p.Dijagnoza,
                    Terapija = p.Terapija,
                    Napomena = p.Napomena,
                    Status = p.Status,

                    PacijentIme = p.Pacijent.Ime,
                    PacijentPrezime = p.Pacijent.Prezime,

                    DoktorIme = korisnik.Doktor.Ime,
                    DoktorPrezime = korisnik.Doktor.Prezime
                })
                .ToListAsync();

            return Ok(pregledi);
        }

        [HttpPut("obradi/{id}")]
        public async Task<IActionResult> ObradiPregled(int id, [FromBody] Pregled updated)
        {
            var pregled = await context.Pregledi.FindAsync(id);
            if (pregled == null) return NotFound();

            pregled.Dijagnoza = updated.Dijagnoza;
            pregled.Terapija = updated.Terapija;
            pregled.Napomena = updated.Napomena;
            pregled.Status = "obavljen";

            await context.SaveChangesAsync();
            return Ok(pregled);
        }

    }
}
