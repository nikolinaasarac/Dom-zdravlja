using API.DTO;
using API.Entities;
using API.RequestHelpers;
using API.Services;
using API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PacijentiController(IPacijentService pacijentService) : ControllerBase
    {
        [Authorize(Roles ="Doktor,Tehnicar,Pacijent,Admin")]
        [HttpGet]
        public async Task<ActionResult<List<Pacijent>>> GetPacijenti([FromQuery] Params pacijentiParams)
        {
            var pacijenti = await pacijentService.GetPacijentiAsync(pacijentiParams, Response);
            return Ok(pacijenti);
        }

        [Authorize(Roles ="Doktor,Tehnicar,Pacijent")]
        [HttpGet("{id}")]
        public async Task<ActionResult<pacijentDto>> GetPacijent(int id)
        {
            var pacijent = await pacijentService.GetPacijentByIdAsync(id);
            if (pacijent == null) return NotFound();
            return Ok(pacijent);
        }

        [Authorize(Roles ="Doktor,Pacijent")]
        [HttpGet("{id}/vakcinacije")]
        public async Task<ActionResult<List<Vakcinacija>>> GetVakcinacijePoPacijentu(int id)
        {
            var vakcinacije = await pacijentService.GetVakcinacijeByPacijentIdAsync(id);
            if (!vakcinacije.Any()) return NotFound();
            return Ok(vakcinacije);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<Pacijent>> KreirajPacijenta(KreirajPacijentaDto pacijentDto)
        {
            var pacijent = await pacijentService.CreatePacijentAsync(pacijentDto);
            if (pacijent == null) return BadRequest("Problem creating new pacijent");
            return CreatedAtAction(nameof(GetPacijenti), new { Id = pacijent.Id }, pacijent);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut]
        public async Task<ActionResult> UpdatePacijent(UpdatePacijentDto pacijentDto)
        {
            var success = await pacijentService.UpdatePacijentAsync(pacijentDto);
            if (!success) return NotFound();
            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id:int}")]
        public async Task<ActionResult> DeletePacijent(int id)
        {
            var success = await pacijentService.DeletePacijentAsync(id);
            if (!success) return NotFound();
            return Ok();
        }
    }
}
