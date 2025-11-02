using API.DTO;
using API.Entities;
using Microsoft.AspNetCore.Http;

namespace API.Services.Interfaces
{
    public interface IZahtjevAnalizeService
    {
        Task<ZahtjevZaAnalizu?> KreirajZahtjevAsync(int pacijentId, KreirajZahtjevAnalizuDto dto, Guid doktorUserId);
        Task<List<ZahtjevZaAnalizuDto>> GetZahtjeviDoktoraAsync(Guid doktorUserId);
        Task<List<ZahtjevZaAnalizuDto>> GetZahtjeviPacijentaAsync(int pacijentId);
        Task<List<ZahtjevZaAnalizuDto>> GetZahtjeviNaCekanjuAsync();
        Task<bool> PromijeniStatusAsync(int zahtjevId, string noviStatus, Guid tehnicarUserId);
        Task<Nalaz?> ZavrsiZahtjevAsync(int zahtjevId, IFormFile file, Guid tehnicarUserId);
        Task<List<ZahtjevZaAnalizuDto>> GetAllZahtjeviAsync();
    }
}
