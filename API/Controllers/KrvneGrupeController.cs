using System.Collections.Generic;
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
    public class KrvneGrupeController(IKrvnaGrupaService krvnaGrupaService) : ControllerBase
    {

        // GET: api/krvnegrupe/pacijent/5
        [Authorize(Roles = "Doktor,Pacijent")]
        [HttpGet("pacijent/{pacijentId}")]
        public async Task<ActionResult<KrvnaGrupaDto>> GetKrvnaGrupa(int pacijentId)
        {
            var grupa = await krvnaGrupaService.GetByPacijentIdAsync(pacijentId);
            if (grupa == null) return Ok("Pacijent nema unesenu grupu");
            return Ok(grupa);
        }

        // POST: api/krvnegrupe/pacijent/5
        [Authorize(Roles="Doktor")]
        [HttpPost("pacijent/{pacijentId}")]
        public async Task<ActionResult<KrvnaGrupaDto>> CreateKrvnaGrupa(
            int pacijentId,
            [FromBody] KreirajKrvnuGrupuDto dto)
        {
            var result = await krvnaGrupaService.CreateAsync(pacijentId, dto);
            if (result == null)
                return BadRequest("Pacijent već ima krvnu grupu ili nije pronađen.");

            return CreatedAtAction(nameof(GetKrvnaGrupa),
                new { pacijentId = pacijentId }, result);
        }

        [Authorize(Roles = "Doktor")]
        [HttpPut("pacijent/{pacijentId}")]
        public async Task<ActionResult<KrvnaGrupaDto>> UpdateKrvnaGrupa(int pacijentId, [FromBody] KreirajKrvnuGrupuDto dto)
        {
            var result = await krvnaGrupaService.UpdateAsync(pacijentId, dto);
            if (result == null) return NotFound("Krvna grupa nije pronađena.");
            return Ok(result);
        }


        // DELETE: api/krvnegrupe/5
        [Authorize(Roles="Doktor")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteKrvnaGrupa(int id)
        {
            var success = await krvnaGrupaService.DeleteAsync(id);
            if (!success) return NotFound("Krvna grupa nije pronađena.");
            return NoContent();
        }
    }
}
