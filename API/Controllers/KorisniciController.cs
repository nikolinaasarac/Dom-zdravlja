using System;
using API.Data;
using API.DTOs;
using API.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class KorisniciController(DomZdravljaContext context, IMapper mapper): ControllerBase
{
    [HttpGet("mojNalog")]
    public async Task<ActionResult<object>> GetMyAccount()
    {
        var username = User.Identity?.Name;
        if (username == null) return Unauthorized();

        var korisnik = await context.Korisnici
            .Include(k => k.Doktor)
            .Include(k => k.Pacijent)
            .FirstOrDefaultAsync(k => k.Username == username);

        if (korisnik == null) return NotFound();

        return new
        {
            korisnik.Id,
            korisnik.Username,
            korisnik.Role,
            Doktor = korisnik.Doktor != null ? new
            {
                korisnik.Doktor.Ime,
                korisnik.Doktor.Prezime,
                korisnik.Doktor.Specijalizacija,
                korisnik.Doktor.BrojLicence,
                korisnik.Doktor.Telefon,
                korisnik.Doktor.Email,
                korisnik.Doktor.Adresa,

            } : null,
            Pacijent = korisnik.Pacijent != null ? new
            {
                korisnik.Pacijent.Ime,
                korisnik.Pacijent.Prezime,
                korisnik.Pacijent.MaticniBroj,
                korisnik.Pacijent.DatumRodjenja,
                korisnik.Pacijent.Adresa
            } : null
        };
    }
    [Authorize]
    [HttpPut("promijeniUsername")]
    public async Task<ActionResult> PromijeniUsername([FromBody] UpdateAccountDto dto)
    {
        var trenutniUsername = User.Identity?.Name;
        if (trenutniUsername == null)
            return Unauthorized();

        if (await context.Korisnici.AnyAsync(k => k.Username == dto.Username))
            return BadRequest(new { message = "Korisničko ime već postoji." });

        var korisnik = await context.Korisnici.FirstOrDefaultAsync(k => k.Username == trenutniUsername);
        if (korisnik == null)
            return NotFound();

        korisnik.Username = dto.Username;
        await context.SaveChangesAsync();

        return Ok(new { message = "Korisničko ime je uspješno promijenjeno.", dto.Username });
    }


    [HttpGet]
    public async Task<ActionResult<IEnumerable<KorisnikDto>>> GetKorisnickiNalozi()
    {
        var korisnici = await context.Korisnici
            .Include(k => k.Doktor)
            .Include(k => k.Pacijent)
            .Select(k => new KorisnikDto
            {
                Id = k.Id,
                Username = k.Username,
                Role = k.Role,
                Ime = k.Doktor != null ? k.Doktor.Ime :
                      k.Pacijent != null ? k.Pacijent.Ime : null,
                Prezime = k.Doktor != null ? k.Doktor.Prezime :
                          k.Pacijent != null ? k.Pacijent.Prezime : null
            })
            .ToListAsync();
        return Ok(korisnici);
    }

   [HttpPost]
public async Task<ActionResult<KorisnikDto>> KreirajNalog(KreirajNalogDto dto)
{
    // Provjera da li korisničko ime već postoji
    if (await context.Korisnici.AnyAsync(u => u.Username == dto.Username))
        return BadRequest("Korisničko ime već postoji.");

    // Provjera da li doktor ili pacijent već imaju nalog
    if (dto.Role == "Doktor" && dto.DoktorId.HasValue)
    {
        bool doktorImaNalog = await context.Korisnici.AnyAsync(
            k => k.Role == "Doktor" && k.DoktorId == dto.DoktorId.Value);
        if (doktorImaNalog)
            return BadRequest("Ovaj doktor već ima nalog.");
    }

    if (dto.Role == "Pacijent" && dto.PacijentId.HasValue)
    {
        bool pacijentImaNalog = await context.Korisnici.AnyAsync(
            k => k.Role == "Pacijent" && k.PacijentId == dto.PacijentId.Value);
        if (pacijentImaNalog)
            return BadRequest("Ovaj pacijent već ima nalog.");
    }

    // Mapiranje DTO -> entitet
    var korisnik = mapper.Map<Korisnik>(dto);

    // Hash lozinke
    var hasher = new PasswordHasher<Korisnik>();
    korisnik.PasswordHash = hasher.HashPassword(korisnik, dto.Password);


    // Spremanje u bazu
    context.Korisnici.Add(korisnik);
    await context.SaveChangesAsync();

    // Mapiranje entitet -> DTO za povrat
    var korisnikDto = mapper.Map<KorisnikDto>(korisnik);
    return Ok(korisnikDto);
}


        [HttpDelete("{id:Guid}")]
        public async Task<ActionResult> DeleteKorisnik(Guid id)
        {
            var korisnik = await context.Korisnici.FindAsync(id);
            if (korisnik == null) return NotFound();

            context.Korisnici.Remove(korisnik);
            var success =  await context.SaveChangesAsync() > 0;
            if (!success) return BadRequest();
            return Ok();
        }
}
