using API.DTOs;
using API.Entities;

namespace API.Services.Interfaces
{
    public interface IUputnicaService
    {
        Task<List<Uputnica>> GetUputniceZaPacijentaAsync(int pacijentId, Guid userId);
        Task<Uputnica> CreateUputnicaAsync(int pacijentId, UputnicaDto dto, Guid userId);
        Task<byte[]> GeneratePdfAsync(int uputnicaId);
    }
}