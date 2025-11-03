using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.DTO;
using API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ZdravstvenaStanjaController(IZdravstvenoStanjeService stanjeService) : ControllerBase
    {

        [HttpGet]
        [Authorize(Roles = "Pacijent")]
        public async Task<ActionResult<IEnumerable<ZdravstvenoStanjeDto>>> GetMojihStanja()
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdStr)) return Unauthorized();

            var userId = Guid.Parse(userIdStr);

            var stanja = await stanjeService.GetStanjaPacijentaByUserIdAsync(userId);

            if (stanja == null || !stanja.Any())
                return Ok("Nema evidentiranih zdravstvenih stanja.");

            return Ok(stanja);
        }

        [HttpGet("pacijent/{pacijentId}")]
        [Authorize(Roles = "Doktor,Admin,Pacijent")]
        public async Task<ActionResult<IEnumerable<ZdravstvenoStanjeDto>>> GetStanjaPacijenta(int pacijentId)
        {
            try
            {
                var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userIdStr)) return BadRequest();

                var userId = Guid.Parse(userIdStr);
                var stanja = await stanjeService.GetStanjaByPacijentIdAsync(pacijentId, userId);

                if (stanja == null || !stanja.Any())
                    return NotFound("Pacijent nema evidentirana zdravstvena stanja.");

                return Ok(stanja);
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

        [HttpPost("pacijent/{pacijentId}")]
        [Authorize(Roles = "Doktor")]
        public async Task<ActionResult<ZdravstvenoStanjeDto>> Create(int pacijentId, [FromBody] KreirajZdravstvenoStanjeDto dto)
        {
            var stanje = await stanjeService.CreateZdravstvenoStanjeAsync(pacijentId, dto);

            if (stanje == null)
                return BadRequest("Problem prilikom kreiranja zdravstvenog stanja");

            return CreatedAtAction(nameof(GetStanjaPacijenta), new { pacijentId }, stanje);
        }
    }
}
