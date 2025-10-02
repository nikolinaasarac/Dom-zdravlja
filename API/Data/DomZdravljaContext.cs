using System;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class DomZdravljaContext(DbContextOptions options) : DbContext(options)
{
  public required DbSet<Pacijent> Pacijenti { get; set; }
  public required DbSet<Vakcinacija> Vakcinacije { get; set; }
}
