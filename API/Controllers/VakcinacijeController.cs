using System.Security.Claims;
using API.Data;
using API.DTO;
using API.Services;
using API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VakcinacijeController(IVakcinacijaService vakcinacijaService) : ControllerBase
    {
        [HttpGet]
        [Authorize(Roles = "Doktor,Pacijent")]
        public async Task<ActionResult<List<VakcinacijaDto>>> GetVakcine()
        {
            var vakcine = await vakcinacijaService.GetAllVakcineAsync();
            return Ok(vakcine);
        }

        [HttpGet("{pacijentId}")]
        [Authorize(Roles = "Doktor,Pacijent")]
        public async Task<ActionResult<IEnumerable<VakcinacijaDto>>> GetVakcineZaPacijenta(int pacijentId)
        {
            try
            {
                var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userIdStr))
                    return BadRequest("Neispravan token.");

                var userId = Guid.Parse(userIdStr);
                var vakcine = await vakcinacijaService.GetVakcineZaPacijentaAsync(userId, pacijentId);

                if (vakcine == null || !vakcine.Any())
                    return NotFound("Pacijent nema evidentirane vakcinacije.");

                return Ok(vakcine);
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


    }
}
