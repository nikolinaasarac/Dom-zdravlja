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

}
