using API.DTOs;
using API.Entities;

namespace API.Services
{
    public interface IUputnicaService
    {
        Task<List<Uputnica>> GetUputniceZaPacijentaAsync(int pacijentId);
        Task<Uputnica> CreateUputnicaAsync(int pacijentId, UputnicaDto dto);
        Task<byte[]> GeneratePdfAsync(int uputnicaId);
    }
}
