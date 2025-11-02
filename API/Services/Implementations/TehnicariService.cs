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
    public class TehnicarService(DomZdravljaContext context, IMapper mapper) : ITehnicarService
    {
        public async Task<PagedList<Tehnicar>> GetTehnicariAsync(Params tehnicarParams, HttpResponse response)
        {
            var query = context.Tehnicari
                .Sort(tehnicarParams.OrderBy)
                .Search(tehnicarParams.SearchTerm)
                .AsQueryable();

            var tehnicari = await PagedList<Tehnicar>.ToPagedList(query, tehnicarParams.PageNumber, tehnicarParams.PageSize);
            response.AddPaginationHeader(tehnicari.Metadata);
            return tehnicari;
        }

        public async Task<TehnicarDto?> GetTehnicarByIdAsync(int id)
        {
            return await context.Tehnicari
                .Where(t => t.Id == id)
                .Select(t => new TehnicarDto
                {
                    Id = t.Id,
                    Ime = t.Ime,
                    Prezime = t.Prezime,
                    MaticniBroj = t.MaticniBroj,
                    Telefon = t.Telefon,
                    Email = t.Email,
                    Adresa = t.Adresa
                })
                .FirstOrDefaultAsync();
        }

        public async Task<Tehnicar?> CreateTehnicarAsync(TehnicarDto dto)
        {
            var t = mapper.Map<Tehnicar>(dto);
            context.Tehnicari.Add(t);
            return await context.SaveChangesAsync() > 0 ? t : null;
        }

        public async Task<bool> UpdateTehnicarAsync(TehnicarDto dto)
        {
            var t = await context.Tehnicari.FindAsync(dto.Id);
            if (t == null) return false;

            mapper.Map(dto, t);
            return await context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteTehnicarAsync(int id)
        {
            var t = await context.Tehnicari.FindAsync(id);
            if (t == null) return false;

            context.Tehnicari.Remove(t);
            return await context.SaveChangesAsync() > 0;
        }
    }
}
