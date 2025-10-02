using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PacijentiController(DomZdravljaContext context) : ControllerBase
    {

        [HttpGet]
        public async Task<ActionResult<List<Pacijent>>> GetPacijenti()
        {
            return await context.Pacijenti.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Pacijent>> GetPacijent(int id)
        {
            var pacijent = await context.Pacijenti.FindAsync(id);

            if (pacijent == null) return NotFound();
            return pacijent;
        }

        [HttpGet("{id}/vakcinacije")]
        public async Task<ActionResult<List<Vakcinacija>>> GetVakcinacijePoPacijentu(int id)
        {
            var pacijent = await context.Pacijenti.FindAsync(id);
            if (pacijent == null) return NotFound();

            var vakcinacije = await context.Vakcinacije
                .Where(v => v.PacijentId == id)
                .ToListAsync();

            return vakcinacije;
        }

        /*[HttpGet("vakcine")]
        public async Task<ActionResult<List<Vakcinacija>>> GetVakcine()
        {
            return await context.Vakcinacije.ToListAsync();
        }*/
    }
}
