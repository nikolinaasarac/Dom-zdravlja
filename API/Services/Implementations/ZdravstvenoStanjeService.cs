using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTO;
using API.Entities;
using API.Services.Interfaces;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace API.Services.Implementations
{
    public class ZdravstvenoStanjeService(DomZdravljaContext context, IMapper mapper) : IZdravstvenoStanjeService
    {
        public async Task<ZdravstvenoStanjeDto?> CreateZdravstvenoStanjeAsync(int pacijentId, KreirajZdravstvenoStanjeDto dto)
{
    var pacijent = await context.Pacijenti.FindAsync(pacijentId);
    if (pacijent == null) return null;

    var stanje = mapper.Map<ZdravstvenoStanje>(dto);
    stanje.PacijentId = pacijentId;

    context.ZdravstvenaStanja.Add(stanje);
    var result = await context.SaveChangesAsync() > 0;

    if (!result) return null;

    // vraćamo DTO, bez navigacionih propertyja
    return new ZdravstvenoStanjeDto
    {
        Id = stanje.Id,
        Naziv = stanje.Naziv,
        Tip = stanje.Tip,
        DatumDijagnoze = stanje.DatumDijagnoze,
        Napomena = stanje.Napomena
    };
}


        // GET ručno mapiran
        public async Task<List<ZdravstvenoStanjeDto>> GetStanjaByPacijentIdAsync(int pacijentId)
        {
            var stanja = await context.ZdravstvenaStanja
                .Where(z => z.PacijentId == pacijentId)
                .Select(z => new ZdravstvenoStanjeDto
                {
                    Id = z.Id,
                    Naziv = z.Naziv,
                    Tip = z.Tip,
                    DatumDijagnoze = z.DatumDijagnoze,
                    Napomena = z.Napomena
                })
                .ToListAsync();

            return stanja;
        }

        public async Task<List<ZdravstvenoStanjeDto>> GetStanjaPacijentaByUserIdAsync(Guid userId)
        {
            var korisnik = await context.Korisnici
                .Include(k => k.Pacijent)
                .FirstOrDefaultAsync(k => k.Id == userId);

            if (korisnik?.Pacijent == null) return new List<ZdravstvenoStanjeDto>();

            return await GetStanjaByPacijentIdAsync(korisnik.Pacijent.Id);
        }
    }
}
