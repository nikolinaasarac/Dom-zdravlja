using API.DTO;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VakcinacijeController(IVakcinacijaService vakcinacijaService) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<List<VakcinacijaDto>>> GetVakcine()
        {
            var vakcine = await vakcinacijaService.GetAllVakcineAsync();
            return Ok(vakcine);
        }

        [Authorize]
        [HttpGet("{pacijentId}")]
        public async Task<ActionResult<List<VakcinacijaDto>>> GetVakcineZaPacijenta(int pacijentId)
        {
            var vakcine = await vakcinacijaService.GetVakcineZaPacijentaAsync(pacijentId);
            return Ok(vakcine);
        }
    }
}
