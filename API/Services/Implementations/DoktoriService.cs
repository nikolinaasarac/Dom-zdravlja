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
    public class DoktorService(DomZdravljaContext context, IMapper mapper) : IDoktorService
    {
        public async Task<PagedList<Doktor>> GetDoktoriAsync(Params doktoriParams, HttpResponse response)
        {
            var query = context.Doktori
                .Sort(doktoriParams.OrderBy)
                .Search(doktoriParams.SearchTerm)
                .AsQueryable();

            var doktori = await PagedList<Doktor>.ToPagedList(query, doktoriParams.PageNumber, doktoriParams.PageSize);
            response.AddPaginationHeader(doktori.Metadata);

            return doktori;
        }

        public async Task<DoktorDto?> GetDoktorByIdAsync(int id)
        {
            return await context.Doktori
                .Where(d => d.Id == id)
                .Select(d => new DoktorDto
                {
                    Id = d.Id,
                    Ime = d.Ime,
                    Prezime = d.Prezime,
                    MaticniBroj = d.MaticniBroj,
                    Specijalizacija = d.Specijalizacija,
                    BrojLicence = d.BrojLicence,
                    Telefon = d.Telefon,
                    Email = d.Email,
                    Adresa = d.Adresa
                })
                .FirstOrDefaultAsync();
        }

        public async Task<Doktor?> CreateDoktorAsync(DoktorDto doktorDto)
        {
            var doktor = mapper.Map<Doktor>(doktorDto);
            context.Doktori.Add(doktor);
            var result = await context.SaveChangesAsync() > 0;
            return result ? doktor : null;
        }

        public async Task<bool> UpdateDoktorAsync(DoktorDto doktorDto)
        {
            var doktor = await context.Doktori.FindAsync(doktorDto.Id);
            if (doktor == null) return false;

            mapper.Map(doktorDto, doktor);
            return await context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteDoktorAsync(int id)
        {
            var doktor = await context.Doktori.FindAsync(id);
            if (doktor == null) return false;

            context.Doktori.Remove(doktor);
            return await context.SaveChangesAsync() > 0;
        }
    }
}
