using API.DTO;
using API.Entities;

namespace API.Services.Interfaces
{
    public interface IZdravstvenoStanjeService
    {
        Task<ZdravstvenoStanjeDto?> CreateZdravstvenoStanjeAsync(int pacijentId, KreirajZdravstvenoStanjeDto dto);
        Task<List<ZdravstvenoStanjeDto>> GetStanjaByPacijentIdAsync(int pacijentId);
        Task<List<ZdravstvenoStanjeDto>> GetStanjaPacijentaByUserIdAsync(Guid userId);
    }
}
