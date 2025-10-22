using API.Data;
using API.DTO;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
    public class DoktorService(DomZdravljaContext _context) : IDoktorService
    {
        public async Task<List<DoktorDto>> GetAllDoktoriAsync()
        {
            return await _context.Doktori
                .Select(d => new DoktorDto
                {
                    Id = d.Id,
                    Ime = d.Ime,
                    Prezime = d.Prezime,
                    Specijalizacija = d.Specijalizacija,
                    BrojLicence = d.BrojLicence,
                    Telefon = d.Telefon,
                    Email = d.Email,
                    Adresa = d.Adresa
                })
                .ToListAsync();
        }
    }
}
