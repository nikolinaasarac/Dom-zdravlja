using API.DTO;
using API.Entities;
using API.RequestHelpers;

namespace API.Services
{
    public interface ITehnicarService
    {
        Task<PagedList<Tehnicar>> GetTehnicariAsync(Params tehnicarParams, HttpResponse response);
        Task<TehnicarDto?> GetTehnicarByIdAsync(int id);
        Task<Tehnicar?> CreateTehnicarAsync(TehnicarDto tehnicarDto);
        Task<bool> UpdateTehnicarAsync(TehnicarDto tehnicarDto);
        Task<bool> DeleteTehnicarAsync(int id);
    }
}
