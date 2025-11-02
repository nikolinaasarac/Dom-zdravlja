using System.Security.Claims;
using API.DTOs;
using API.Services;
using API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ZahtjevZaPregledController(IZahtjevZaPregledService service) : ControllerBase
    {
        [HttpPost]
        [Authorize(Roles = "Pacijent")]
        public async Task<IActionResult> KreirajZahtjev([FromBody] KreirajZahtjevDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized("Nije moguće prepoznati korisnika.");

            var result = await service.KreirajZahtjev(Guid.Parse(userId), dto);
            if (result == null) return BadRequest("Greška pri kreiranju zahtjeva.");

            return Ok(result);
        }

        [HttpGet("doktor")]
        [Authorize(Roles = "Doktor")]
        public async Task<IActionResult> GetZahtjeviZaDoktora()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            return Ok(await service.GetZahtjeviZaDoktora(Guid.Parse(userId)));
        }

        [HttpGet("pacijent")]
        [Authorize(Roles = "Pacijent, Doktor")]
        public async Task<IActionResult> GetZahtjeviZaPacijenta()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            return Ok(await service.GetZahtjeviZaPacijenta(Guid.Parse(userId)));
        }

        [HttpGet("moji-zahtjevi")]
        [Authorize(Roles = "Doktor,Pacijent")]
        public async Task<IActionResult> GetMojiZahtjevi()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            return Ok(await service.GetMojiZahtjevi(Guid.Parse(userId)));
        }

        [HttpPut("odobri/{id}")]
        [Authorize(Roles = "Doktor")]
        public async Task<IActionResult> PrihvatiZahtjev(int id, [FromBody] DateTime datumPregleda)
        {
            var result = await service.PrihvatiZahtjev(id, datumPregleda);
            if (!result) return NotFound("Zahtjev nije pronađen.");
            return Ok(new { message = "Zahtjev prihvaćen i pregled zakazan." });
        }

        [HttpPut("odbij/{id}")]
        [Authorize(Roles = "Doktor")]
        public async Task<IActionResult> OdbijZahtjev(int id)
        {
            var result = await service.OdbijZahtjev(id);
            if (!result) return NotFound("Zahtjev nije pronađen.");
            return Ok(new { message = "Zahtjev odbijen." });
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAllZahtjevi()
        {
            return Ok(await service.GetAllZahtjevi());
        }
    }
}
