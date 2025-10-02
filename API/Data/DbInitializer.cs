using System;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class DbInitializer
{
  public static void InitDb(WebApplication app)
  {
    using var scope = app.Services.CreateScope();
    var context = scope.ServiceProvider.GetRequiredService<DomZdravljaContext>()
    ?? throw new InvalidOperationException("Failed to retrieve context");

    SeedData(context);

  }

  private static void SeedData(DomZdravljaContext context)
{
    context.Database.Migrate();

    if (!context.Pacijenti.Any())
    {
      // 1️⃣ Dodaj pacijente
      var pacijenti = new List<Pacijent>
        {
            new Pacijent { Ime = "Marko", Prezime = "Petrović", DatumRodjenja = new DateOnly(1990,5,12), Pol="Muški", Adresa="Ulica Kralja Petra I 45, Banja Luka", Telefon="+38765123456" },
            new Pacijent { Ime = "Jelena", Prezime = "Nikolić", DatumRodjenja = new DateOnly(1985,11,3), Pol="Ženski", Adresa="Cara Dušana 22, Istočno Sarajevo", Telefon="+38765456789" },
            new Pacijent { Ime = "Milan", Prezime = "Jovanović", DatumRodjenja = new DateOnly(2000,2,28), Pol="Muški", Adresa="Njegoševa 10, Trebinje", Telefon="+38765222333" },
            new Pacijent { Ime = "Ana", Prezime = "Kovačević", DatumRodjenja = new DateOnly(1997,7,19), Pol="Ženski", Adresa="Meše Selimovića 5, Bijeljina", Telefon="+38765987654" }
        };
      context.Pacijenti.AddRange(pacijenti);
      context.SaveChanges(); // ✅ Id-jevi su sada generisani
    }

        // 2️⃣ Seed vakcinacije
    if(!context.Vakcinacije.Any()) {
      var vakcinacije = new List<Vakcinacija>
        {
            new Vakcinacija { PacijentId = 1, NazivVakcine="COVID-19", DatumPrimanja=new DateOnly(2021,3,15), Doza=1, Napomena="Bez komplikacija" },
            new Vakcinacija { PacijentId = 2, NazivVakcine="COVID-19", DatumPrimanja=new DateOnly(2021,4,15), Doza=2 },
            new Vakcinacija { PacijentId = 1, NazivVakcine="Grip", DatumPrimanja=new DateOnly(2022,10,1), Doza=1 },
            new Vakcinacija { PacijentId = 3, NazivVakcine="Hepatitis B", DatumPrimanja=new DateOnly(2018,6,20), Doza=1 },
            new Vakcinacija { PacijentId = 4, NazivVakcine="COVID-19", DatumPrimanja=new DateOnly(2021,5,10), Doza=1, Napomena="Blaga reakcija" }
        };
        context.Vakcinacije.AddRange(vakcinacije);
        context.SaveChanges();
    }
}
}


