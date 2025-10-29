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

    // 🔹 Pacijenti
    if (!context.Pacijenti.Any())
    {
      var pacijenti = new List<Pacijent>
      {
        new Pacijent { Ime = "Marko", Prezime = "Petrović", DatumRodjenja = new DateOnly(1990,5,12), Pol="Muški", Adresa="Ulica Kralja Petra I 45, Banja Luka", Telefon="+38765123456", MaticniBroj="1205990123456" },
        new Pacijent { Ime = "Jelena", Prezime = "Nikolić", DatumRodjenja = new DateOnly(1985,11,3), Pol="Ženski", Adresa="Cara Dušana 22, Istočno Sarajevo", Telefon="+38765456789", MaticniBroj="0311985654321" },
        new Pacijent { Ime = "Milan", Prezime = "Jovanović", DatumRodjenja = new DateOnly(2000,2,28), Pol="Muški", Adresa="Njegoševa 10, Trebinje", Telefon="+38765222333", MaticniBroj="2802000123456" },
        new Pacijent { Ime = "Ana", Prezime = "Kovačević", DatumRodjenja = new DateOnly(1997,7,19), Pol="Ženski", Adresa="Meše Selimovića 5, Bijeljina", Telefon="+38765987654", MaticniBroj="1907997654321" }
      };
      context.Pacijenti.AddRange(pacijenti);
      context.SaveChanges();
    }

    // 🔹 Vakcinacije
    if (!context.Vakcinacije.Any())
    {
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

    // 🔹 Doktori
    if (!context.Doktori.Any())
    {
      var doktori = new List<Doktor>
      {
        new Doktor { Ime = "Petar", Prezime = "Ilić", MaticniBroj="1547856254123", Specijalizacija = "Opšta praksa", BrojLicence = "L12345", Telefon = "+38765111222", Email = "petar.ilic@domzdravlja.ba", Adresa = "Kralja Tomislava 1, Banja Luka" },
        new Doktor { Ime = "Marina", Prezime = "Savić", MaticniBroj="1245875412563", Specijalizacija = "Pediatrija", BrojLicence = "L67890", Telefon = "+38765333444", Email = "marina.savic@domzdravlja.ba", Adresa = "Vojvode Radomira Putnika 3, Bijeljina" },
        new Doktor { Ime = "Nenad", Prezime = "Jokić", MaticniBroj="1247854632145", Specijalizacija = "Kardiologija", BrojLicence = "L24680", Telefon = "+38765455666", Email = "nenad.jokic@domzdravlja.ba", Adresa = "Karađorđeva 12, Trebinje" }
      };
      context.Doktori.AddRange(doktori);
      context.SaveChanges();
    }

    // 🔹 Tehničari
    if (!context.Tehnicari.Any())
    {
      var tehnicari = new List<Tehnicar>
      {
        new Tehnicar { Ime = "Ivana", Prezime = "Stanković", MaticniBroj="1478563245125", Telefon = "+38765888888", Email = "ivana.stankovic@domzdravlja.ba", Adresa = "Nikole Tesle 14, Banja Luka" },
        new Tehnicar { Ime = "Miloš", Prezime = "Babić", MaticniBroj="1236521478541", Telefon = "+38765123455", Email = "milos.babic@domzdravlja.ba", Adresa = "Patrijarha Pavla 9, Bijeljina" },
        new Tehnicar { Ime = "Sandra", Prezime = "Mihajlović", MaticniBroj="1365478526541", Telefon = "+38765987650", Email = "sandra.mihajlovic@domzdravlja.ba", Adresa = "Srpskih Vladara 20, Trebinje" }
      };
      context.Tehnicari.AddRange(tehnicari);
      context.SaveChanges();
    }
  }
}
