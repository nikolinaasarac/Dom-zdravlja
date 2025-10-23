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

        [HttpGet("doktor/{doktorId}")]
        public async Task<List<PregledDto>> GetPreglediZaDoktoraAsync(int doktorId)
        {
            return await context.Pregledi
                .Where(p => p.DoktorId == doktorId)
                .Include(p => p.Pacijent)
                .Include(p => p.Doktor)
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

                    DoktorIme = p.Doktor.Ime,
                    DoktorPrezime = p.Doktor.Prezime
                })
                .ToListAsync();
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
