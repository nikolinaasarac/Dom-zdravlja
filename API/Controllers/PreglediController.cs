using System.Security.Claims;
using API.DTO;
using API.Services;
using API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PreglediController(IPregledService pregledService) : ControllerBase
    {
        [Authorize(Roles = "Doktor,Pacijent")]
        [HttpGet("{pacijentId}")]
        public async Task<ActionResult<List<PregledDto>>> GetPregledi(int pacijentId)
        {
            try
            {
                var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userIdStr)) return BadRequest("Neispravan token.");

                var userId = Guid.Parse(userIdStr);

                var pregledi = await pregledService.GetPreglediByPacijentIdAsync(pacijentId, userId);

                if (pregledi == null || !pregledi.Any())
                    return NotFound("Pacijent nema evidentirane preglede.");

                return Ok(pregledi);
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized();
            }
            catch (InvalidOperationException)
            {
                return Forbid();
            }
        }

        [Authorize(Roles = "Doktor")]
        [HttpGet("doktor/pregledi")]
        public async Task<IActionResult> GetPreglediZaPrijavljenogDoktora()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim is null)
                return Unauthorized();

            var userId = Guid.Parse(userIdClaim);
            var pregledi = await pregledService.GetPreglediZaDoktoraAsync(userId);

            if (pregledi.Count == 0)
                return BadRequest("Prijavljeni korisnik nije doktor ili nema pregleda.");

            return Ok(pregledi);
        }

        [Authorize(Roles = "Doktor")]
        [HttpPut("obradi/{id}")]
        public async Task<IActionResult> ObradiPregled(int id, [FromBody] UpdatePregledDto dto)
        {
            var result = await pregledService.ObradiPregledAsync(id, dto);
            if (!result)
                return NotFound();

            return Ok("Pregled uspješno obrađen.");
        }
    }
}
