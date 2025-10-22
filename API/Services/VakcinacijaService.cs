using API.Data;
using API.DTO;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
    public class VakcinacijaService(DomZdravljaContext context) : IVakcinacijaService
    {
        public async Task<List<VakcinacijaDto>> GetAllVakcineAsync()
        {
            return await context.Vakcinacije
                .Include(v => v.Pacijent)
                .Select(v => new VakcinacijaDto
                {
                    Id = v.Id,
                    NazivVakcine = v.NazivVakcine,
                    DatumPrimanja = v.DatumPrimanja,
                    Doza = v.Doza,
                    Napomena = v.Napomena,
                    PacijentIme = v.Pacijent.Ime,
                    PacijentPrezime = v.Pacijent.Prezime
                })
                .ToListAsync();
        }

        public async Task<List<VakcinacijaDto>> GetVakcineZaPacijentaAsync(int pacijentId)
        {
            return await context.Vakcinacije
                .Where(v => v.PacijentId == pacijentId)
                .Include(v => v.Pacijent)
                .Select(v => new VakcinacijaDto
                {
                    Id = v.Id,
                    NazivVakcine = v.NazivVakcine,
                    DatumPrimanja = v.DatumPrimanja,
                    Doza = v.Doza,
                    Napomena = v.Napomena,
                    PacijentIme = v.Pacijent.Ime,
                    PacijentPrezime = v.Pacijent.Prezime
                })
                .ToListAsync();
        }
    }
}
