using API.Data;
using API.DTO;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
    public class PregledService(DomZdravljaContext context) : IPregledService
    {
        public async Task<List<PregledDto>> GetPreglediByPacijentIdAsync(int pacijentId)
        {
            return await context.Pregledi
                .Where(p => p.PacijentId == pacijentId)
                .Include(p => p.Pacijent)
                .Include(p => p.Doktor)
                .Select(p => new PregledDto
                {
                    Id = p.Id,
                    DatumPregleda = p.DatumPregleda,
                    VrstaPregleda = p.VrstaPregleda,
                    OpisSimptoma = p.OpisSimptoma,
                    Dijagnoza = p.Dijagnoza,
                    Terapija = p.Terapija,
                    Napomena = p.Napomena,
                    Status = p.Status,

                    PacijentIme = p.Pacijent.Ime,
                    PacijentPrezime = p.Pacijent.Prezime,

                    DoktorIme = p.Doktor.Ime,
                    DoktorPrezime = p.Doktor.Prezime
                })
                .ToListAsync();
        }
    }
}
