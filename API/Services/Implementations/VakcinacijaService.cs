using API.Data;
using API.DTO;
using API.Entities;
using API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace API.Services.Implementations
{
    public class VakcinacijaService : IVakcinacijaService
    {
        private readonly DomZdravljaContext _context;

        public VakcinacijaService(DomZdravljaContext context)
        {
            _context = context;
        }

        public async Task<List<VakcinacijaDto>> GetAllVakcineAsync()
        {
            return await _context.Vakcinacije
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

        public async Task<List<VakcinacijaDto>> GetVakcineZaPacijentaAsync(Guid userId, int pacijentId)
        {
            var korisnik = await _context.Korisnici
                .FirstOrDefaultAsync(k => k.Id == userId);

            if (korisnik == null)
                throw new UnauthorizedAccessException();

            if (korisnik.Role == "Pacijent" && korisnik.PacijentId != pacijentId)
                throw new InvalidOperationException("Nedozvoljen pristup"); 

            return await _context.Vakcinacije
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
