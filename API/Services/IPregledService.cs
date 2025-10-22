using API.DTO;

namespace API.Services
{
    public interface IPregledService
    {
        Task<List<PregledDto>> GetPreglediByPacijentIdAsync(int pacijentId);
    }
}
