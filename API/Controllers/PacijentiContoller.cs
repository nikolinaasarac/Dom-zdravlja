using API.Data;
using API.Entities;
using API.Extensions;
using API.RequestHelpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PacijentiController(DomZdravljaContext context) : ControllerBase
    {

        
    [Authorize]
  [HttpGet]
   public async Task<ActionResult<List<Pacijent>>> GetPacijenti([FromQuery]Params pacijentiParams)
        {
            var query = context.Pacijenti
            .Sort(pacijentiParams.OrderBy)
            .Filter(pacijentiParams.Pol)
            .Search(pacijentiParams.SearchTerm)
            .AsQueryable();

             var pacijenti = await PagedList<Pacijent>.ToPagedList(query, pacijentiParams.PageNumber,
            pacijentiParams.PageSize);

            Response.AddPaginationHeader(pacijenti.Metadata);

            return pacijenti;
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
