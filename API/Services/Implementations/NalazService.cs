using API.Data;
using API.DTO;
using API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Services.Implementations
{
    public class NalazService(DomZdravljaContext context) : INalazService
    {
        public async Task<List<NalazDto>> GetNalaziZaPacijentaAsync(int pacijentId, Guid userId)
        {
            var korisnik = await context.Korisnici.FirstOrDefaultAsync(k => k.Id == userId);
            if (korisnik == null)
                throw new UnauthorizedAccessException();

            if (korisnik.Role == "Pacijent" && korisnik.PacijentId != pacijentId)
                throw new InvalidOperationException("Nedozvoljen pristup");

            return await context.Nalazi
                .Include(n => n.Pacijent)
                .Include(n => n.Tehnicar)
                .Where(n => n.PacijentId == pacijentId)
                .Select(n => new NalazDto
                {
                    Id = n.Id,
                    PacijentId = n.PacijentId,
                    TehnicarId = n.TehnicarId,
                    FilePath = n.FilePath ?? string.Empty,
                    DatumDodavanja = n.DatumDodavanja,
                    PacijentIme = n.Pacijent.Ime,
                    PacijentPrezime = n.Pacijent.Prezime,
                    TehnicarIme = n.Tehnicar != null ? n.Tehnicar.Ime : null,
                    TehnicarPrezime = n.Tehnicar != null ? n.Tehnicar.Prezime : null
                })
                .ToListAsync();
        }


        public async Task<ActionResult<List<NalazDto>>> GetSviNalazi()
        {
            var nalazi = await context.Nalazi
                .Include(n => n.Pacijent)
                .Include(n => n.Tehnicar)
                .Select(n => new NalazDto
                {
                    Id = n.Id,
                    PacijentId = n.PacijentId,
                    TehnicarId = n.TehnicarId,
                    FilePath = n.FilePath ?? string.Empty,
                    DatumDodavanja = n.DatumDodavanja,
                    PacijentIme = n.Pacijent.Ime,
                    PacijentPrezime = n.Pacijent.Prezime,
                    TehnicarIme = n.Tehnicar != null ? n.Tehnicar.Ime : null,
                    TehnicarPrezime = n.Tehnicar != null ? n.Tehnicar.Prezime : null
                })
                .ToListAsync();

            return new OkObjectResult(nalazi);
        }

        public async Task<IActionResult> GetPdf(int id)
        {
            var nalaz = await context.Nalazi.FindAsync(id);
            if (nalaz == null || string.IsNullOrEmpty(nalaz.FilePath))
                return new NotFoundObjectResult("Nalaz nije pronađen.");

            var filePath = Path.Combine("wwwroot", nalaz.FilePath);
            if (!System.IO.File.Exists(filePath))
                return new NotFoundObjectResult("PDF fajl ne postoji.");

            var memory = new MemoryStream();
            using (var stream = new FileStream(filePath, FileMode.Open))
            {
                await stream.CopyToAsync(memory);
            }
            memory.Position = 0;
            return new FileStreamResult(memory, "application/pdf")
            {
                FileDownloadName = Path.GetFileName(filePath)
            };
        }

        public async Task<ActionResult<NalazDto>> GetNalazById(int id)
        {
            var nalaz = await context.Nalazi
                .Include(n => n.Pacijent)
                .Include(n => n.Tehnicar)
                .FirstOrDefaultAsync(n => n.Id == id);

            if (nalaz == null)
                return new NotFoundObjectResult("Nalaz nije pronađen.");

            var result = new NalazDto
            {
                Id = nalaz.Id,
                PacijentId = nalaz.PacijentId,
                TehnicarId = nalaz.TehnicarId,
                FilePath = nalaz.FilePath ?? string.Empty,
                DatumDodavanja = nalaz.DatumDodavanja,
                PacijentIme = nalaz.Pacijent.Ime,
                PacijentPrezime = nalaz.Pacijent.Prezime,
                TehnicarIme = nalaz.Tehnicar?.Ime,
                TehnicarPrezime = nalaz.Tehnicar?.Prezime
            };

            return new OkObjectResult(result);
        }
    }
}
