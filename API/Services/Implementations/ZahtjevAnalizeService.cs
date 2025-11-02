using API.Data;
using API.DTO;
using API.Entities;
using API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Services.Implementations
{
  public class ZahtjevAnalizeService(DomZdravljaContext context) : IZahtjevAnalizeService
  {
    public async Task<ZahtjevZaAnalizu?> KreirajZahtjevAsync(int pacijentId, KreirajZahtjevAnalizuDto dto, Guid doktorUserId)
    {
      var korisnik = await context.Korisnici.Include(k => k.Doktor)
                                            .FirstOrDefaultAsync(k => k.Id == doktorUserId);
      if (korisnik?.Doktor == null) return null;

      var pacijent = await context.Pacijenti.FindAsync(pacijentId);
      if (pacijent == null) return null;

      var zahtjev = new ZahtjevZaAnalizu
      {
        PacijentId = pacijent.Id,
        Pacijent = pacijent,
        DoktorId = korisnik.Doktor.Id,
        Doktor = korisnik.Doktor,
        Opis = dto.Opis,
        Status = "Na čekanju",
        DatumZahtjeva = DateTime.Now
      };

      context.ZahtjeviZaAnalizu.Add(zahtjev);
      await context.SaveChangesAsync();
      return zahtjev;
    }

    public async Task<List<ZahtjevZaAnalizuDto>> GetZahtjeviDoktoraAsync(Guid doktorUserId)
    {
      var korisnik = await context.Korisnici.Include(k => k.Doktor)
                                            .FirstOrDefaultAsync(k => k.Id == doktorUserId);
      if (korisnik?.Doktor == null) return new List<ZahtjevZaAnalizuDto>();

      var zahtjevi = await context.ZahtjeviZaAnalizu
          .Include(z => z.Pacijent)
          .Include(z => z.Tehnicar)
          .Where(z => z.DoktorId == korisnik.Doktor.Id)
          .Select(z => new ZahtjevZaAnalizuDto
          {
            Id = z.Id,
            PacijentId = z.PacijentId,
            PacijentIme = z.Pacijent.Ime,
            PacijentPrezime = z.Pacijent.Prezime,
            DoktorId = z.DoktorId,
            DoktorIme = korisnik.Doktor.Ime,
            DoktorPrezime = korisnik.Doktor.Prezime,
            TehnicarId = z.TehnicarId,
            TehnicarIme = z.Tehnicar != null ? z.Tehnicar.Ime : null,
            TehnicarPrezime = z.Tehnicar != null ? z.Tehnicar.Prezime : null,
            Opis = z.Opis,
            Status = z.Status,
            DatumZahtjeva = z.DatumZahtjeva
          }).ToListAsync();

      return zahtjevi;
    }

    public async Task<List<ZahtjevZaAnalizuDto>> GetZahtjeviPacijentaAsync(int pacijentId)
    {
      var zahtjevi = await context.ZahtjeviZaAnalizu
          .Include(z => z.Pacijent)
          .Include(z => z.Doktor)
          .Include(z => z.Tehnicar)
          .Where(z => z.PacijentId == pacijentId)
          .Select(z => new ZahtjevZaAnalizuDto
          {
            Id = z.Id,
            PacijentId = z.PacijentId,
            PacijentIme = z.Pacijent.Ime,
            PacijentPrezime = z.Pacijent.Prezime,
            DoktorId = z.DoktorId,
            DoktorIme = z.Doktor.Ime,
            DoktorPrezime = z.Doktor.Prezime,
            TehnicarId = z.TehnicarId,
            TehnicarIme = z.Tehnicar != null ? z.Tehnicar.Ime : null,
            TehnicarPrezime = z.Tehnicar != null ? z.Tehnicar.Prezime : null,
            Opis = z.Opis,
            Status = z.Status,
            DatumZahtjeva = z.DatumZahtjeva
          }).ToListAsync();

      return zahtjevi;
    }

    public async Task<List<ZahtjevZaAnalizuDto>> GetZahtjeviNaCekanjuAsync()
    {
      var zahtjevi = await context.ZahtjeviZaAnalizu
          .Where(z => z.Status == "Na čekanju")
          .Include(z => z.Pacijent)
          .Include(z => z.Doktor)
          .Include(z => z.Tehnicar)
          .Select(z => new ZahtjevZaAnalizuDto
          {
            Id = z.Id,
            PacijentId = z.PacijentId,
            PacijentIme = z.Pacijent.Ime,
            PacijentPrezime = z.Pacijent.Prezime,
            DoktorId = z.DoktorId,
            DoktorIme = z.Doktor.Ime,
            DoktorPrezime = z.Doktor.Prezime,
            TehnicarId = z.TehnicarId,
            TehnicarIme = z.Tehnicar != null ? z.Tehnicar.Ime : null,
            TehnicarPrezime = z.Tehnicar != null ? z.Tehnicar.Prezime : null,
            Opis = z.Opis,
            Status = z.Status,
            DatumZahtjeva = z.DatumZahtjeva
          }).ToListAsync();

      return zahtjevi;
    }

    public async Task<bool> PromijeniStatusAsync(int zahtjevId, string noviStatus, Guid tehnicarUserId)
    {
      if (noviStatus != "U obradi" && noviStatus != "Obrađen" && noviStatus != "Odbijen" && noviStatus != "Na čekanju")
        return false;

      var korisnik = await context.Korisnici.Include(k => k.Tehnicar)
                                            .FirstOrDefaultAsync(k => k.Id == tehnicarUserId);
      if (korisnik?.Tehnicar == null) return false;

      var zahtjev = await context.ZahtjeviZaAnalizu.Include(z => z.Pacijent)
                                                    .FirstOrDefaultAsync(z => z.Id == zahtjevId);
      if (zahtjev == null) return false;

      if (zahtjev.TehnicarId == null)
      {
        zahtjev.TehnicarId = korisnik.Tehnicar.Id;
        zahtjev.Tehnicar = korisnik.Tehnicar;
      }

      zahtjev.Status = noviStatus;
      await context.SaveChangesAsync();
      return true;
    }

    public async Task<Nalaz?> ZavrsiZahtjevAsync(int zahtjevId, IFormFile file, Guid tehnicarUserId)
    {
      var korisnik = await context.Korisnici.Include(k => k.Tehnicar)
                                            .FirstOrDefaultAsync(k => k.Id == tehnicarUserId);
      if (korisnik?.Tehnicar == null) return null;

      var zahtjev = await context.ZahtjeviZaAnalizu.Include(z => z.Pacijent)
                                                    .FirstOrDefaultAsync(z => z.Id == zahtjevId);
      if (zahtjev == null || file == null || file.Length == 0) return null;

      if (zahtjev.TehnicarId == null)
      {
        zahtjev.TehnicarId = korisnik.Tehnicar.Id;
        zahtjev.Tehnicar = korisnik.Tehnicar;
      }

      var folderPath = Path.Combine("wwwroot", "uploads", "nalazi");
      if (!Directory.Exists(folderPath))
        Directory.CreateDirectory(folderPath);

      var fileName = $"nalaz_{zahtjev.Id}_{DateTime.Now:yyyyMMddHHmmss}.pdf";
      var filePath = Path.Combine(folderPath, fileName);

      using (var stream = new FileStream(filePath, FileMode.Create))
      {
        await file.CopyToAsync(stream);
      }

      var nalaz = new Nalaz
      {
        ZahtjevZaAnalizuId = zahtjev.Id,
        ZahtjevZaAnalizu = zahtjev,
        PacijentId = zahtjev.PacijentId,
        Pacijent = zahtjev.Pacijent,
        TehnicarId = zahtjev.TehnicarId,
        Tehnicar = zahtjev.Tehnicar,
        FilePath = $"uploads/nalazi/{fileName}",
        DatumDodavanja = DateTime.Now
      };

      context.Nalazi.Add(nalaz);
      zahtjev.Status = "Obrađen";

      await context.SaveChangesAsync();

      return nalaz;
    }

    public async Task<List<ZahtjevZaAnalizuDto>> GetAllZahtjeviAsync()
    {
      var zahtjevi = await context.ZahtjeviZaAnalizu
          .Include(z => z.Pacijent)
          .Include(z => z.Doktor)
          .Include(z => z.Tehnicar)
          .Select(z => new ZahtjevZaAnalizuDto
          {
            Id = z.Id,
            PacijentId = z.PacijentId,
            PacijentIme = z.Pacijent.Ime,
            PacijentPrezime = z.Pacijent.Prezime,
            DoktorId = z.DoktorId,
            DoktorIme = z.Doktor.Ime,
            DoktorPrezime = z.Doktor.Prezime,
            TehnicarId = z.TehnicarId,
            TehnicarIme = z.Tehnicar != null ? z.Tehnicar.Ime : null,
            TehnicarPrezime = z.Tehnicar != null ? z.Tehnicar.Prezime : null,
            Opis = z.Opis,
            Status = z.Status,
            DatumZahtjeva = z.DatumZahtjeva
          }).ToListAsync();

      return zahtjevi;
    }
  }
}
