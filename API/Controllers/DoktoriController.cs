using API.DTO;
using API.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DoktoriController(IDoktorService doktorService) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<List<DoktorDto>>> GetDoktori()
        {
            var doktori = await doktorService.GetAllDoktoriAsync();
            return Ok(doktori);
        }
    }
}
