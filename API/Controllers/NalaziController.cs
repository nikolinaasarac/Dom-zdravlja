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
            => await service.GetNalaziZaPacijenta(pacijentId);

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
