using API.Data;
using API.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class PreglediController(DomZdravljaContext context) : ControllerBase
{
    [HttpGet("{pacijentId}")]
    public async Task<ActionResult<List<PregledDto>>> GetPregledi(int pacijentId)
    {
        var pregledi = await context.Pregledi
            .Where(v => v.PacijentId == pacijentId)
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

        return pregledi;
    }
}
