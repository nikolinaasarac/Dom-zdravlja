using API.DTO;
using API.Services;
using API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VakcinacijeController(IVakcinacijaService vakcinacijaService) : ControllerBase
    {
        [HttpGet]
        [Authorize(Roles ="Doktor,Pacijent")]
        public async Task<ActionResult<List<VakcinacijaDto>>> GetVakcine()
        {
            var vakcine = await vakcinacijaService.GetAllVakcineAsync();
            return Ok(vakcine);
        }

        [Authorize(Roles ="Doktor,Pacijent")]
        [HttpGet("{pacijentId}")]
        public async Task<ActionResult<List<VakcinacijaDto>>> GetVakcineZaPacijenta(int pacijentId)
        {
            var vakcine = await vakcinacijaService.GetVakcineZaPacijentaAsync(pacijentId);
            return Ok(vakcine);
        }
    }
}
