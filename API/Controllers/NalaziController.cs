using System.Security.Claims;
using API.DTO;
using API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NalaziController(INalazService service) : ControllerBase
    {
        [Authorize(Roles = "Doktor,Pacijent")]
        [HttpGet("pacijent/{pacijentId}")]
        public async Task<ActionResult<List<NalazDto>>> GetNalaziZaPacijenta(int pacijentId)
        {
            try
            {
                var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userIdStr))
                    return BadRequest("Neispravan token.");

                var userId = Guid.Parse(userIdStr);

                var nalazi = await service.GetNalaziZaPacijentaAsync(pacijentId, userId);

                if (nalazi == null || nalazi.Count == 0)
                    return NotFound("Nema nalaza za izabranog pacijenta.");

                return Ok(nalazi);
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
        [HttpGet]
        public async Task<ActionResult<List<NalazDto>>> GetSviNalazi()
            => await service.GetSviNalazi();

        [HttpGet("{id}/pdf")]
        [Authorize(Roles = "Doktor,Pacijent")]
        public async Task<IActionResult> GetPdf(int id)
            => await service.GetPdf(id);

        [Authorize(Roles = "Doktor,Pacijent")]
        [HttpGet("{id}")]
        public async Task<ActionResult<NalazDto>> GetNalazById(int id)
            => await service.GetNalazById(id);
    }
}
