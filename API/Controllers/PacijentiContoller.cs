using API.Data;
using API.DTO;
using API.Entities;
using API.Extensions;
using API.RequestHelpers;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PacijentiController(DomZdravljaContext context, IMapper mapper) : ControllerBase
    {


        [Authorize]
        [HttpGet]
        public async Task<ActionResult<List<Pacijent>>> GetPacijenti([FromQuery] Params pacijentiParams)
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
        public async Task<ActionResult<pacijentDto>> GetPacijent(int id)
        {
            var pacijent = await context.Pacijenti
        .Where(p => p.Id == id)
        .Select(p => new pacijentDto
        {
            Ime = p.Ime,
            Prezime = p.Prezime,
            DatumRodjenja = p.DatumRodjenja,
            Pol = p.Pol,
            Adresa = p.Adresa,
            Telefon = p.Telefon,
            MaticniBroj = p.MaticniBroj
        })
        .FirstOrDefaultAsync();

            if (pacijent == null)
                return NotFound();

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

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<Pacijent>> KreirajPacijenta(KreirajPacijentaDto pacijentDto)
        {
            var pacijent = mapper.Map<Pacijent>(pacijentDto);


            context.Pacijenti.Add(pacijent);

            var result = await context.SaveChangesAsync() > 0;

            if (result) return CreatedAtAction(nameof(GetPacijenti), new { Id = pacijent.Id }, pacijent);

            return BadRequest("Problem creating new pacijent");
        }

        [Authorize(Roles = "Admin")]
        [HttpPut]
        public async Task<ActionResult> UpdatePacijent(UpdatePacijentDto pacijentDto)
        {
            var pacijent = await context.Pacijenti.FindAsync(pacijentDto.Id);

            if (pacijent == null) return NotFound();

            mapper.Map(pacijentDto, pacijent);

            var result = await context.SaveChangesAsync() > 0;

            if (result) return NoContent();

            return BadRequest("Problem updating pacijent");
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id:int}")]
        public async Task<ActionResult> DeletePacijent(int id)
        {
            var pacijent = await context.Pacijenti.FindAsync(id);

            if (pacijent == null) return NotFound();

            context.Pacijenti.Remove(pacijent);

            var result = await context.SaveChangesAsync() > 0;

            if (result) return Ok();

            return BadRequest("Problem deleting the pacijent");
        }
    }
}
