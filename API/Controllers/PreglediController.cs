using API.DTO;
using API.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PreglediController(IPregledService pregledService) : ControllerBase
    {
        [HttpGet("{pacijentId}")]
        public async Task<ActionResult<List<PregledDto>>> GetPregledi(int pacijentId)
        {
            var pregledi = await pregledService.GetPreglediByPacijentIdAsync(pacijentId);
            return Ok(pregledi);
        }
    }
}
