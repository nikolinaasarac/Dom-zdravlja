using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.DTO;
using API.Services;
using API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ZdravstvenaStanjaController (IZdravstvenoStanjeService stanjeService) : ControllerBase
{
        // GET: moja stanja za pacijenta
        [HttpGet]
        [Authorize(Roles = "Pacijent")]
        public async Task<ActionResult<IEnumerable<ZdravstvenoStanjeDto>>> GetMojihStanja()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();

            var userId = Guid.Parse(userIdClaim.Value);

            var stanja = await stanjeService.GetStanjaPacijentaByUserIdAsync(userId);

            if (stanja == null || !stanja.Any())
                return Ok("Nema evidentiranih zdravstvenih stanja.");

            return Ok(stanja);
        }

        // GET: stanja bilo kojeg pacijenta
        [HttpGet("pacijent/{pacijentId}")]
        [Authorize(Roles = "Doktor,Admin")]
        public async Task<ActionResult<IEnumerable<ZdravstvenoStanjeDto>>> GetStanjaPacijenta(int pacijentId)
        {
            var stanja = await stanjeService.GetStanjaByPacijentIdAsync(pacijentId);

            if (stanja == null || !stanja.Any())
                return NotFound("Pacijent nema evidentirana zdravstvena stanja.");

            return Ok(stanja);
        }

        // POST: kreiranje stanja za pacijenta
        [HttpPost("pacijent/{pacijentId}")]
        [Authorize(Roles="Doktor")]
        public async Task<ActionResult<ZdravstvenoStanjeDto>> Create(
            int pacijentId,
            [FromBody] KreirajZdravstvenoStanjeDto dto)
        {
            var stanje = await stanjeService.CreateZdravstvenoStanjeAsync(pacijentId, dto);

            if (stanje == null)
                return BadRequest("Problem prilikom kreiranja zdravstvenog stanja");

            return CreatedAtAction(
                nameof(GetStanjaPacijenta),
                new { pacijentId = pacijentId },
                stanje);
        }
    }
}
