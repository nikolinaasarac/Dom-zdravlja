using System.Threading.Tasks;
using API.Data;
using API.DTO;
using API.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
    public class KrvnaGrupaService(DomZdravljaContext context, IMapper mapper) : IKrvnaGrupaService
    {
        public async Task<KrvnaGrupaDto?> GetByPacijentIdAsync(int pacijentId)
        {
            var grupa = await context.KrvneGrupe
                .FirstOrDefaultAsync(k => k.PacijentId == pacijentId);

            if (grupa == null) return null;

            return new KrvnaGrupaDto
            {
                Id = grupa.Id,
                PacijentId = pacijentId,
                Grupa = grupa.Grupa,
                Faktor = grupa.Faktor
            };
        }

        public async Task<KrvnaGrupaDto?> CreateAsync(int pacijentId, KreirajKrvnuGrupuDto dto)
        {
            var pacijent = await context.Pacijenti.FindAsync(pacijentId);
            if (pacijent == null) return null;

            var postojeca = await context.KrvneGrupe
                .FirstOrDefaultAsync(k => k.PacijentId == pacijentId);

            if (postojeca != null) return null;

            var nova = mapper.Map<KrvnaGrupa>(dto);
            nova.PacijentId = pacijentId;

            context.KrvneGrupe.Add(nova);
            var result = await context.SaveChangesAsync() > 0;

            return result ? new KrvnaGrupaDto
            {
                Id = nova.Id,
                PacijentId = pacijentId,
                Grupa = nova.Grupa,
                Faktor = nova.Faktor
            } : null;
        }

        public async Task<KrvnaGrupaDto?> UpdateAsync(int pacijentId, KreirajKrvnuGrupuDto dto)
        {
            var grupa = await context.KrvneGrupe.FirstOrDefaultAsync(k => k.PacijentId == pacijentId);
            if (grupa == null) return null;

            mapper.Map(dto, grupa);
            var result = await context.SaveChangesAsync() > 0;

            return result ? new KrvnaGrupaDto
            {
                Id = grupa.Id,
                PacijentId = pacijentId,
                Grupa = grupa.Grupa,
                Faktor = grupa.Faktor
            } : null;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var grupa = await context.KrvneGrupe.FindAsync(id);
            if (grupa == null) return false;

            context.KrvneGrupe.Remove(grupa);
            return await context.SaveChangesAsync() > 0;
        }
    }
}

