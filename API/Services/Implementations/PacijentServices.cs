using API.Data;
using API.DTO;
using API.Entities;
using API.Extensions;
using API.RequestHelpers;
using API.Services.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace API.Services.Implementations
{
    public class PacijentService(DomZdravljaContext context, IMapper mapper) : IPacijentService
    {
        public async Task<PagedList<Pacijent>> GetPacijentiAsync(Params pacijentiParams, HttpResponse response)
        {

            var query = context.Pacijenti
                .Sort(pacijentiParams.OrderBy)
                .Filter(pacijentiParams.Pol)
                .Search(pacijentiParams.SearchTerm)
                .AsQueryable();

            var pacijenti = await PagedList<Pacijent>.ToPagedList(query, pacijentiParams.PageNumber, pacijentiParams.PageSize);

            response.AddPaginationHeader(pacijenti.Metadata);

            return pacijenti;
        }

        public async Task<pacijentDto?> GetPacijentByIdAsync(Guid userId, int pacijentId)
        {
            // 🔹 Dohvati korisnika
            var korisnik = await context.Korisnici
                .FirstOrDefaultAsync(k => k.Id == userId);

            if (korisnik == null)
                throw new UnauthorizedAccessException();

            // 🔹 Ako je pacijent, može pristupiti samo svom PacijentId
            if (korisnik.Role == "Pacijent" && korisnik.PacijentId != pacijentId)
                throw new InvalidOperationException("Nedozvoljen pristup");

            // 🔹 Dohvati pacijenta
            return await context.Pacijenti
                .Where(p => p.Id == pacijentId)
                .Select(p => new pacijentDto
                {
                    Ime = p.Ime,
                    Prezime = p.Prezime,
                    DatumRodjenja = p.DatumRodjenja,
                    Pol = p.Pol,
                    Adresa = p.Adresa,
                    Telefon = p.Telefon,
                    MaticniBroj = p.MaticniBroj
                })
                .FirstOrDefaultAsync();
        }


        public async Task<List<Vakcinacija>> GetVakcinacijeByPacijentIdAsync(int id)
        {
            var pacijent = await context.Pacijenti.FindAsync(id);
            if (pacijent == null) return new List<Vakcinacija>();

            return await context.Vakcinacije.Where(v => v.PacijentId == id).ToListAsync();
        }

        public async Task<Pacijent?> CreatePacijentAsync(KreirajPacijentaDto pacijentDto)
        {
            var pacijent = mapper.Map<Pacijent>(pacijentDto);
            context.Pacijenti.Add(pacijent);
            var result = await context.SaveChangesAsync() > 0;
            return result ? pacijent : null;
        }

        public async Task<bool> UpdatePacijentAsync(UpdatePacijentDto pacijentDto)
        {
            var pacijent = await context.Pacijenti.FindAsync(pacijentDto.Id);
            if (pacijent == null) return false;

            mapper.Map(pacijentDto, pacijent);
            return await context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeletePacijentAsync(int id)
        {
            var pacijent = await context.Pacijenti.FindAsync(id);
            if (pacijent == null) return false;

            context.Pacijenti.Remove(pacijent);
            return await context.SaveChangesAsync() > 0;
        }

        public async Task<int?> GetPacijentIdByKorisnikIdAsync(Guid korisnikId)
        {
            var korisnik = await context.Korisnici
                            .Where(k => k.Id == korisnikId)
                            .Select(k => new { k.PacijentId })
                            .FirstOrDefaultAsync();

            return korisnik?.PacijentId;
        }
    }
}
