using API.DTOs;
using API.Entities;

namespace API.Services.Interfaces
{
    public interface IReceptService
    {
        Task<List<Recept>> GetReceptiZaPacijentaAsync(int pacijentId);
        Task<Recept> CreateReceptAsync(int pacijentId, ReceptDto dto, Guid doktorUserId);
        Task<Recept> GetReceptPdfAsync(int id);
    }
}
