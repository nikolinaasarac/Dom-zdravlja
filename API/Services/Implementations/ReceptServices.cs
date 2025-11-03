using API.Data;
using API.DTOs;
using API.Entities;
using API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Services.Implementations
{
    public class ReceptService(DomZdravljaContext context) : IReceptService
    {
        public async Task<List<Recept>> GetReceptiZaPacijentaAsync(int pacijentId, Guid userId)
        {
            var korisnik = await context.Korisnici.FirstOrDefaultAsync(k => k.Id == userId);
            if (korisnik == null)
                throw new UnauthorizedAccessException();

            // Pacijent može vidjeti samo svoje recepte
            if (korisnik.Role == "Pacijent" && korisnik.PacijentId != pacijentId)
                throw new InvalidOperationException("Nedozvoljen pristup");

            return await context.Recepti
                .Where(r => r.PacijentId == pacijentId)
                .Include(r => r.Pacijent)
                .Include(r => r.Doktor)
                .ToListAsync();
        }

        public async Task<Recept> CreateReceptAsync(int pacijentId, ReceptDto dto, Guid doktorUserId)
        {
            var korisnik = await context.Korisnici
                .Include(k => k.Doktor)
                .FirstOrDefaultAsync(k => k.Id == doktorUserId);

            if (korisnik?.Doktor == null)
                return null;

            var pacijent = await context.Pacijenti.FindAsync(pacijentId);
            if (pacijent == null)
                return null;

            var recept = new Recept
            {
                PacijentId = pacijentId,
                Pacijent = pacijent,
                DoktorId = korisnik.Doktor.Id,
                Doktor = korisnik.Doktor,
                NazivLijeka = dto.NazivLijeka,
                Kolicina = dto.Kolicina,
                NacinUzimanja = dto.NacinUzimanja,
                Napomena = dto.Napomena,
                DatumIzdavanja = DateTime.Now
            };

            context.Recepti.Add(recept);
            await context.SaveChangesAsync();

            return recept;
        }

        public async Task<Recept> GetReceptPdfAsync(int id)
        {
            var recept = await context.Recepti
                .Include(r => r.Pacijent)
                .Include(r => r.Doktor)
                .FirstOrDefaultAsync(r => r.Id == id);

            return recept;
        }
    }
}
