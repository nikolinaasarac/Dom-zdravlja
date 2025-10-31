using API.DTO;
using API.Entities;
using API.RequestHelpers;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TehnicariController(ITehnicarService service) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<List<Tehnicar>>> GetTehnicari([FromQuery] Params tehnicarParams)
        {
            var tehnicari = await service.GetTehnicariAsync(tehnicarParams, Response);
            return Ok(tehnicari);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<TehnicarDto>> GetTehnicar(int id)
        {
            var t = await service.GetTehnicarByIdAsync(id);
            if (t == null) return NotFound();
            return Ok(t);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<Tehnicar>> CreateTehnicar(TehnicarDto dto)
        {
            var t = await service.CreateTehnicarAsync(dto);
            if (t == null) return BadRequest();
            return CreatedAtAction(nameof(GetTehnicari), new { id = t.Id }, t);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut]
        public async Task<ActionResult> UpdateTehnicar(TehnicarDto dto)
        {
            var success = await service.UpdateTehnicarAsync(dto);
            if (!success) return NotFound();
            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id:int}")]
        public async Task<ActionResult> DeleteTehnicar(int id)
        {
            var success = await service.DeleteTehnicarAsync(id);
            if (!success) return NotFound();
            return Ok();
        }
    }
}
