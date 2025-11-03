using API.DTO;

namespace API.Services.Interfaces
{
    public interface IVakcinacijaService
    {
        Task<List<VakcinacijaDto>> GetAllVakcineAsync();
        Task<List<VakcinacijaDto>> GetVakcineZaPacijentaAsync(Guid userId, int pacijentId);
    }
}
