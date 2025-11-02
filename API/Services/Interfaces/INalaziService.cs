using API.DTO;
using Microsoft.AspNetCore.Mvc;

namespace API.Services.Interfaces
{
    public interface INalazService
    {
        Task<ActionResult<List<NalazDto>>> GetNalaziZaPacijenta(int pacijentId);
        Task<ActionResult<List<NalazDto>>> GetSviNalazi();
        Task<IActionResult> GetPdf(int id);
        Task<ActionResult<NalazDto>> GetNalazById(int id);
    }
}
