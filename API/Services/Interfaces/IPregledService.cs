using API.DTO;

namespace API.Services.Interfaces
{
    public interface IPregledService
    {
        Task<List<PregledDto>> GetPreglediByPacijentIdAsync(int pacijentId);
        Task<List<PregledDto>> GetPreglediZaDoktoraAsync(Guid userId);
        Task<bool> ObradiPregledAsync(int id, UpdatePregledDto dto);
    }
}
