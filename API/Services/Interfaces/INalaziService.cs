using API.DTO;
using Microsoft.AspNetCore.Mvc;

namespace API.Services.Interfaces
{
    public interface INalazService
    {
        Task<List<NalazDto>> GetNalaziZaPacijentaAsync(int pacijentId, Guid userId);
        Task<ActionResult<List<NalazDto>>> GetSviNalazi();
        Task<IActionResult> GetPdf(int id);
        Task<ActionResult<NalazDto>> GetNalazById(int id);
    }
}
