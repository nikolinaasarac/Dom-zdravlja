using System;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class DomZdravljaContext(DbContextOptions options) : DbContext(options)
{
  public required DbSet<Pacijent> Pacijenti { get; set; }
  public required DbSet<Vakcinacija> Vakcinacije { get; set; }
  public required DbSet<Korisnik> Korisnici { get; set; }
  public required DbSet<RefreshToken> RefreshTokens { get; set; }
  public required DbSet<Doktor> Doktori { get; set; }
  public required DbSet<Pregled> Pregledi { get; set; }
  public required DbSet<Uputnica> Uputnice { get; set; }
  public required DbSet<ZahtjevZaPregled> ZahtjeviZaPregled { get; set; }

  public required DbSet<ZahtjevZaAnalizu> ZahtjeviZaAnalizu { get; set; }
  public required DbSet<Nalaz> Nalazi { get; set; }
  public required DbSet<Tehnicar> Tehnicari { get; set; }
  public required DbSet<Recept> Recepti { get; set; }
  public required DbSet<ZdravstvenoStanje> ZdravstvenaStanja { get; set; }
  public required DbSet<KrvnaGrupa> KrvneGrupe { get; set; }

}
