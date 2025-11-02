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
    public class DoktoriController(IDoktorService doktorService) : ControllerBase
    {
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<ActionResult<List<Doktor>>> GetDoktori([FromQuery] Params doktoriParams)
        {
            var doktori = await doktorService.GetDoktoriAsync(doktoriParams, Response);
            return Ok(doktori);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("{id:int}")]
        public async Task<ActionResult<DoktorDto>> GetDoktor(int id)
        {
            var doktor = await doktorService.GetDoktorByIdAsync(id);
            if (doktor == null) return NotFound();
            return Ok(doktor);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<Doktor>> KreirajDoktora(DoktorDto doktorDto)
        {
            var doktor = await doktorService.CreateDoktorAsync(doktorDto);
            if (doktor == null) return BadRequest("Problem pri kreiranju naloga doktora.");
            return CreatedAtAction(nameof(GetDoktori), new { Id = doktor.Id }, doktor);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut]
        public async Task<ActionResult> UpdateDoktor(DoktorDto doktorDto)
        {
            var success = await doktorService.UpdateDoktorAsync(doktorDto);
            if (!success) return NotFound();
            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id:int}")]
        public async Task<ActionResult> DeleteDoktor(int id)
        {
            var success = await doktorService.DeleteDoktorAsync(id);
            if (!success) return NotFound();
            return Ok();
        }
    }
}
