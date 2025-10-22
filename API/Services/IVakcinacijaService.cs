using API.DTO;
using API.Entities;

namespace API.Services
{
    public interface IVakcinacijaService
    {
        Task<List<VakcinacijaDto>> GetAllVakcineAsync();
        Task<List<VakcinacijaDto>> GetVakcineZaPacijentaAsync(int pacijentId);
    }
}
