using API.Data;
using API.DTOs;
using API.Entities;
using API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Services.Implementations
{
  public class ZahtjevZaPregledService(DomZdravljaContext context) : IZahtjevZaPregledService
  {

    public async Task<ZahtjevZaPregledDto?> KreirajZahtjev(Guid korisnikId, KreirajZahtjevDto dto)
    {
      var korisnik = await context.Korisnici
          .Include(k => k.Pacijent)
          .FirstOrDefaultAsync(k => k.Id == korisnikId);

      if (korisnik?.Pacijent == null) return null;

      var pacijent = korisnik.Pacijent;
      var doktor = await context.Doktori.FindAsync(dto.DoktorId);
      if (doktor == null) return null;

      var zahtjev = new ZahtjevZaPregled
      {
        PacijentId = pacijent.Id,
        Pacijent = pacijent,
        DoktorId = doktor.Id,
        Doktor = doktor,
        Opis = dto.Opis,
        Status = "Na čekanju",
        DatumZahtjeva = DateTime.Now
      };

      context.ZahtjeviZaPregled.Add(zahtjev);
      await context.SaveChangesAsync();

      return new ZahtjevZaPregledDto
      {
        Id = zahtjev.Id,
        DatumZahtjeva = zahtjev.DatumZahtjeva,
        Opis = zahtjev.Opis,
        Status = zahtjev.Status,
        PacijentIme = pacijent.Ime,
        PacijentPrezime = pacijent.Prezime,
        DoktorIme = doktor.Ime,
        DoktorPrezime = doktor.Prezime
      };
    }

    public async Task<List<ZahtjevZaPregledDto>> GetZahtjeviZaDoktora(Guid doktorKorisnikId)
    {
      var korisnik = await context.Korisnici
          .Include(k => k.Doktor)
          .FirstOrDefaultAsync(k => k.Id == doktorKorisnikId);

      if (korisnik?.Doktor == null) return new List<ZahtjevZaPregledDto>();

      var zahtjevi = await context.ZahtjeviZaPregled
          .Include(z => z.Pacijent)
          .Include(z => z.Doktor)
          .Where(z => z.DoktorId == korisnik.Doktor.Id)
          .Select(z => new ZahtjevZaPregledDto
          {
            Id = z.Id,
            DatumZahtjeva = z.DatumZahtjeva,
            Opis = z.Opis,
            Status = z.Status,
            PacijentIme = z.Pacijent.Ime,
            PacijentPrezime = z.Pacijent.Prezime,
            DoktorIme = z.Doktor.Ime,
            DoktorPrezime = z.Doktor.Prezime
          }).ToListAsync();

      return zahtjevi;
    }

    public async Task<List<ZahtjevZaPregledDto>> GetZahtjeviZaPacijenta(Guid pacijentKorisnikId)
    {
      var korisnik = await context.Korisnici
          .Include(k => k.Pacijent)
          .FirstOrDefaultAsync(k => k.Id == pacijentKorisnikId);

      if (korisnik?.Pacijent == null) return new List<ZahtjevZaPregledDto>();

      var zahtjevi = await context.ZahtjeviZaPregled
          .Include(z => z.Pacijent)
          .Include(z => z.Doktor)
          .Where(z => z.PacijentId == korisnik.Pacijent.Id)
          .Select(z => new ZahtjevZaPregledDto
          {
            Id = z.Id,
            DatumZahtjeva = z.DatumZahtjeva,
            Opis = z.Opis,
            Status = z.Status,
            PacijentIme = z.Pacijent.Ime,
            PacijentPrezime = z.Pacijent.Prezime,
            DoktorIme = z.Doktor.Ime,
            DoktorPrezime = z.Doktor.Prezime
          }).ToListAsync();

      return zahtjevi;
    }

    public async Task<List<ZahtjevZaPregledDto>> GetMojiZahtjevi(Guid korisnikId)
    {
      var korisnik = await context.Korisnici
          .Include(k => k.Doktor)
          .Include(k => k.Pacijent)
          .FirstOrDefaultAsync(k => k.Id == korisnikId);

      if (korisnik == null) return new List<ZahtjevZaPregledDto>();

      IQueryable<ZahtjevZaPregled> query = context.ZahtjeviZaPregled
          .Include(z => z.Pacijent)
          .Include(z => z.Doktor);

      if (korisnik.Doktor != null)
        query = query.Where(z => z.DoktorId == korisnik.Doktor.Id);
      else if (korisnik.Pacijent != null)
        query = query.Where(z => z.PacijentId == korisnik.Pacijent.Id);
      else
        return new List<ZahtjevZaPregledDto>();

      return await query.Select(z => new ZahtjevZaPregledDto
      {
        Id = z.Id,
        DatumZahtjeva = z.DatumZahtjeva,
        Opis = z.Opis,
        Status = z.Status,
        PacijentIme = z.Pacijent.Ime,
        PacijentPrezime = z.Pacijent.Prezime,
        DoktorIme = z.Doktor.Ime,
        DoktorPrezime = z.Doktor.Prezime
      }).ToListAsync();
    }

    public async Task<bool> PrihvatiZahtjev(int zahtjevId, DateTime datumPregleda)
    {
      var zahtjev = await context.ZahtjeviZaPregled
          .Include(z => z.Pacijent)
          .Include(z => z.Doktor)
          .FirstOrDefaultAsync(z => z.Id == zahtjevId);

      if (zahtjev == null) return false;

      zahtjev.Status = "Prihvaćen";

      context.Pregledi.Add(new Pregled
      {
        DatumPregleda = datumPregleda,
        VrstaPregleda = "Opšti pregled",
        OpisSimptoma = zahtjev.Opis,
        PacijentId = zahtjev.PacijentId,
        DoktorId = zahtjev.DoktorId,
        ZahtjevZaPregledId = zahtjev.Id,
        Status = "zakazan"
      });

      await context.SaveChangesAsync();
      return true;
    }

    public async Task<bool> OdbijZahtjev(int zahtjevId)
    {
      var zahtjev = await context.ZahtjeviZaPregled.FindAsync(zahtjevId);
      if (zahtjev == null) return false;

      zahtjev.Status = "Odbijen";
      await context.SaveChangesAsync();
      return true;
    }

    public async Task<List<ZahtjevZaPregledDto>> GetAllZahtjevi()
    {
      return await context.ZahtjeviZaPregled
          .Include(z => z.Pacijent)
          .Include(z => z.Doktor)
          .Select(z => new ZahtjevZaPregledDto
          {
            Id = z.Id,
            DatumZahtjeva = z.DatumZahtjeva,
            Opis = z.Opis,
            Status = z.Status,
            PacijentIme = z.Pacijent.Ime,
            PacijentPrezime = z.Pacijent.Prezime,
            DoktorIme = z.Doktor.Ime,
            DoktorPrezime = z.Doktor.Prezime
          }).ToListAsync();
    }
  }
}
