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
    public class ZdravstvenoStanjeService : IZdravstvenoStanjeService
    {
        private readonly DomZdravljaContext _context;
        private readonly IMapper _mapper;

        public ZdravstvenoStanjeService(DomZdravljaContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<ZdravstvenoStanjeDto?> CreateZdravstvenoStanjeAsync(int pacijentId, KreirajZdravstvenoStanjeDto dto)
        {
            var pacijent = await _context.Pacijenti.FindAsync(pacijentId);
            if (pacijent == null) return null;

            var stanje = _mapper.Map<ZdravstvenoStanje>(dto);
            stanje.PacijentId = pacijentId;

            _context.ZdravstvenaStanja.Add(stanje);
            var result = await _context.SaveChangesAsync() > 0;

            if (!result) return null;

            return new ZdravstvenoStanjeDto
            {
                Id = stanje.Id,
                Naziv = stanje.Naziv,
                Tip = stanje.Tip,
                DatumDijagnoze = stanje.DatumDijagnoze,
                Napomena = stanje.Napomena
            };
        }

        public async Task<List<ZdravstvenoStanjeDto>> GetStanjaByPacijentIdAsync(int pacijentId, Guid userId)
        {
            var korisnik = await _context.Korisnici.FirstOrDefaultAsync(k => k.Id == userId);
            if (korisnik == null) throw new UnauthorizedAccessException();

            if (korisnik.Role == "Pacijent" && korisnik.PacijentId != pacijentId)
                throw new InvalidOperationException("Nedozvoljen pristup");

            return await _context.ZdravstvenaStanja
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
        }

        public async Task<List<ZdravstvenoStanjeDto>> GetStanjaPacijentaByUserIdAsync(Guid userId)
        {
            var korisnik = await _context.Korisnici
                .Include(k => k.Pacijent)
                .FirstOrDefaultAsync(k => k.Id == userId);

            if (korisnik?.Pacijent == null) return new List<ZdravstvenoStanjeDto>();

            return await GetStanjaByPacijentIdAsync(korisnik.Pacijent.Id, userId);
        }
    }
}
