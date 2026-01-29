using System.Security.Claims;
using API.Data;
using API.DTO;
using API.Entities;
using API.Services.Interfaces;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace API.Services.Implementations
{
    public class PregledService(DomZdravljaContext context, IMapper mapper)
        : IPregledService
    {
        public async Task<List<PregledDto>> GetPreglediByPacijentIdAsync(int pacijentId, Guid userId)
        {
            var korisnik = await context.Korisnici.FirstOrDefaultAsync(k => k.Id == userId);
            if (korisnik == null)
                throw new UnauthorizedAccessException();

            if (korisnik.Role == "Pacijent" && korisnik.PacijentId != pacijentId)
                throw new InvalidOperationException("Nedozvoljen pristup");

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

        public async Task<List<PregledDto>> GetPreglediZaDoktoraAsync(Guid userId)
        {
            var korisnik = await context.Korisnici
                .Include(u => u.Doktor)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (korisnik?.Doktor == null)
                return [];

            var doktorId = korisnik.Doktor.Id;

            return await context.Pregledi
                .Where(p => p.DoktorId == doktorId)
                .Include(p => p.Pacijent)
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
                    DoktorIme = korisnik.Doktor.Ime,
                    DoktorPrezime = korisnik.Doktor.Prezime
                })
                .ToListAsync();
        }

        public async Task<bool> ObradiPregledAsync(int id, UpdatePregledDto dto)
        {
            var pregled = await context.Pregledi.FindAsync(id);
            if (pregled == null)
                return false;

            pregled.Status = "Završen";
            mapper.Map(dto, pregled);

            await context.SaveChangesAsync();
            return true;
        }
    }
}
