using API.DTO;

namespace API.Services
{
    public interface IDoktorService
    {
        Task<List<DoktorDto>> GetAllDoktoriAsync();
    }
}
