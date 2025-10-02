using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VakcinacijeController(DomZdravljaContext context) : ControllerBase
    {
        // Vrati sve vakcine sa info o pacijentu
        [HttpGet]
        public async Task<ActionResult<List<VakcinacijaDto>>> GetVakcine()
        {
            var vakcine = await context.Vakcinacije
                .Include(v => v.Pacijent)
                .Select(v => new VakcinacijaDto
                {
                    Id = v.Id,
                    NazivVakcine = v.NazivVakcine,
                    DatumPrimanja = v.DatumPrimanja,
                    Doza = v.Doza,
                    Napomena = v.Napomena,
                    PacijentIme = v.Pacijent.Ime,
                    PacijentPrezime = v.Pacijent.Prezime
                })
                .ToListAsync();

            return vakcine;
        }

        // Vrati sve vakcine za jednog pacijenta
        [HttpGet("{pacijentId}")]
        public async Task<ActionResult<List<VakcinacijaDto>>> GetVakcineZaPacijenta(int pacijentId)
        {
            var vakcine = await context.Vakcinacije
                .Where(v => v.PacijentId == pacijentId)
                .Include(v => v.Pacijent)
                .Select(v => new VakcinacijaDto
                {
                    Id = v.Id,
                    NazivVakcine = v.NazivVakcine,
                    DatumPrimanja = v.DatumPrimanja,
                    Doza = v.Doza,
                    Napomena = v.Napomena,
                    PacijentIme = v.Pacijent.Ime,
                    PacijentPrezime = v.Pacijent.Prezime
                })
                .ToListAsync();

            return vakcine;
        }
    }
}
