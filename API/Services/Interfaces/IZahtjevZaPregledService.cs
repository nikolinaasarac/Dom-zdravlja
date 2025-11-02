using API.DTOs;

namespace API.Services.Interfaces
{
  public interface IZahtjevZaPregledService
  {
    Task<ZahtjevZaPregledDto?> KreirajZahtjev(Guid korisnikId, KreirajZahtjevDto dto);
    Task<List<ZahtjevZaPregledDto>> GetZahtjeviZaDoktora(Guid doktorKorisnikId);
    Task<List<ZahtjevZaPregledDto>> GetZahtjeviZaPacijenta(Guid pacijentKorisnikId);
    Task<List<ZahtjevZaPregledDto>> GetMojiZahtjevi(Guid korisnikId);
    Task<bool> PrihvatiZahtjev(int zahtjevId, DateTime datumPregleda);
    Task<bool> OdbijZahtjev(int zahtjevId);
    Task<List<ZahtjevZaPregledDto>> GetAllZahtjevi();
  }
}
