using System.Security.Claims;
using API.DTOs;
using API.Entities;
using API.Services;
using API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UputniceController(IUputnicaService uputnicaService) : ControllerBase
    {
        [HttpGet("{pacijentId}")]
        [Authorize(Roles = "Doktor,Pacijent")]
        public async Task<ActionResult<List<Uputnica>>> GetUputniceZaPacijenta(int pacijentId)
        {
            try
            {
                var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userIdStr))
                    return BadRequest("Neispravan token.");

                var userId = Guid.Parse(userIdStr);

                var uputnice = await uputnicaService.GetUputniceZaPacijentaAsync(pacijentId, userId);

                if (uputnice == null || !uputnice.Any())
                    return NotFound("Nema uputnica za ovog pacijenta.");

                return Ok(uputnice);
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
        [HttpPost("{pacijentId}")]
        public async Task<ActionResult<Uputnica>> CreateUputnica(int pacijentId, [FromBody] UputnicaDto dto)
        {
            var uputnica = await uputnicaService.CreateUputnicaAsync(pacijentId, dto);
            if (uputnica == null)
                return NotFound("Pacijent nije pronađen");
            return Ok(uputnica);
        }

        [Authorize(Roles = "Doktor,Pacijent")]
        [HttpGet("{id}/pdf")]
        public async Task<IActionResult> GetUputnicaPdf(int id)
        {
            var pdfBytes = await uputnicaService.GeneratePdfAsync(id);
            if (pdfBytes == null) return NotFound();
            return File(pdfBytes, "application/pdf", $"uputnica_{id}.pdf");
        }
    }
}
