using API.DTO;
using API.Entities;
using API.RequestHelpers;

namespace API.Services.Interfaces
{
    public interface IPacijentService
    {
        Task<PagedList<Pacijent>> GetPacijentiAsync(Params pacijentiParams, HttpResponse response);
        Task<pacijentDto?> GetPacijentByIdAsync(Guid userId, int pacijentId); // 🔹 Dodano

        Task<List<Vakcinacija>> GetVakcinacijeByPacijentIdAsync(int id);
        Task<Pacijent?> CreatePacijentAsync(KreirajPacijentaDto pacijentDto);
        Task<bool> UpdatePacijentAsync(UpdatePacijentDto pacijentDto);
        Task<bool> DeletePacijentAsync(int id);
        Task<int?> GetPacijentIdByKorisnikIdAsync(Guid korisnikId);

    }
}
