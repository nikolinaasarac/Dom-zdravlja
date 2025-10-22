using API.DTOs;
using API.Entities;
using API.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UputniceController(IUputnicaService uputnicaService) : ControllerBase
    {
        [HttpGet("{pacijentId}")]
        public async Task<ActionResult<List<Uputnica>>> GetUputniceZaPacijenta(int pacijentId)
        {
            var uputnice = await uputnicaService.GetUputniceZaPacijentaAsync(pacijentId);
            if (uputnice == null || !uputnice.Any())
                return NotFound("Nema uputnica za ovog pacijenta.");
            return Ok(uputnice);
        }

        [HttpPost("{pacijentId}")]
        public async Task<ActionResult<Uputnica>> CreateUputnica(int pacijentId, [FromBody] UputnicaDto dto)
        {
            var uputnica = await uputnicaService.CreateUputnicaAsync(pacijentId, dto);
            if (uputnica == null)
                return NotFound("Pacijent nije pronađen");
            return Ok(uputnica);
        }

        [HttpGet("{id}/pdf")]
        public async Task<IActionResult> GetUputnicaPdf(int id)
        {
            var pdfBytes = await uputnicaService.GeneratePdfAsync(id);
            if (pdfBytes == null) return NotFound();
            return File(pdfBytes, "application/pdf", $"uputnica_{id}.pdf");
        }
    }
}
