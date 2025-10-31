using API.DTO;
using API.Entities;
using API.RequestHelpers;
using Microsoft.AspNetCore.Http;

namespace API.Services
{
    public interface IDoktorService
    {
        Task<PagedList<Doktor>> GetDoktoriAsync(Params doktoriParams, HttpResponse response);
        Task<DoktorDto?> GetDoktorByIdAsync(int id);
        Task<Doktor?> CreateDoktorAsync(DoktorDto doktorDto);
        Task<bool> UpdateDoktorAsync(DoktorDto doktorDto);
        Task<bool> DeleteDoktorAsync(int id);
    }
}
