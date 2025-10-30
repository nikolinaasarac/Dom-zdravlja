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
public class KorisniciController(DomZdravljaContext context): ControllerBase
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

    //korisnici/kreiraj-nalog
    [HttpPost("kreiraj-nalog")]
    public async Task<IActionResult> KreirajNalog(KreirajNalogDto request)
    {
        if (await context.Korisnici.AnyAsync(u => u.Username == request.Username))
            return BadRequest("Postoji korisnik sa tim korisnickim imenom");

        var user = new Korisnik();
        var hasher = new PasswordHasher<Korisnik>();
        user.PasswordHash = hasher.HashPassword(user, request.Password);
        user.Username = request.Username;
        user.Role = request.Role;

        // ✅ 2. Ako je uloga Admin, samo kreiraj korisnika
        if (request.Role == "Admin")
        {
            user.MustChangePassword = true;
            context.Korisnici.Add(user);
            await context.SaveChangesAsync();
            return Ok(user);
        }

        // ✅ 3. Za sve ostale — provjeri matični broj
        if (string.IsNullOrEmpty(request.MaticniBroj))
            throw new Exception("Matični broj je obavezan za ovu ulogu.");

        if (request.Role == "Doktor")
        {
            var doktor = await context.Doktori
                .FirstOrDefaultAsync(d => d.MaticniBroj == request.MaticniBroj);

            if (doktor == null)
                return BadRequest("Doktor sa unesenim matičnim brojem ne postoji.");

            var postoji = await context.Korisnici.AnyAsync(k => k.DoktorId == doktor.Id);
            if (postoji)
                return BadRequest("Već postoji aktivan nalog za ovog doktora.");

            user.DoktorId = doktor.Id;
        }
        else if (request.Role == "Pacijent")
        {
            var pacijent = await context.Pacijenti
                .FirstOrDefaultAsync(p => p.MaticniBroj == request.MaticniBroj);

            if (pacijent == null)
                return BadRequest("Pacijent sa unesenim matičnim brojem ne postoji.");

            var postoji = await context.Korisnici.AnyAsync(k => k.PacijentId == pacijent.Id);
            if (postoji)
                return BadRequest("Već postoji aktivan nalog za ovog pacijenta.");

            user.PacijentId = pacijent.Id;
        }
        else if (request.Role == "Tehnicar")
        {
            var tehnicar = await context.Tehnicari
                .FirstOrDefaultAsync(t => t.MaticniBroj == request.MaticniBroj);

            if (tehnicar == null)
                return BadRequest("Tehničar sa unesenim matičnim brojem ne postoji.");

            var postoji = await context.Korisnici.AnyAsync(k => k.TehnicarId == tehnicar.Id);
            if (postoji)
                BadRequest("Već postoji aktivan nalog za ovog tehničara.");

            user.TehnicarId = tehnicar.Id;
        }

        // ✅ 4. Dodaj novog korisnika i sačuvaj
        user.MustChangePassword = true;
        context.Korisnici.Add(user);
        await context.SaveChangesAsync();

        return Ok(user);
    }

    [Authorize]
    [HttpPut("promijeniLozinku")]
    public async Task<ActionResult> PromijeniLozinku([FromBody] PromjeniLozinkuDto dto)
    {
        if (dto.NovaLozinka != dto.NovaLozinkaPotvrda)
            return BadRequest("Lozinke se ne poklapaju.");

        var username = User.Identity?.Name;
        if (username == null)
            return Unauthorized();

        var korisnik = await context.Korisnici.FirstOrDefaultAsync(k => k.Username == username);
        if (korisnik == null)
            return NotFound("Korisnik nije pronađen.");

        var hasher = new PasswordHasher<Korisnik>();
        korisnik.PasswordHash = hasher.HashPassword(korisnik, dto.NovaLozinka);
        korisnik.MustChangePassword = false;
        await context.SaveChangesAsync();

        return Ok(new { message = "Lozinka uspješno promijenjena." });
    }

    [Authorize(Roles = "Admin")]
[HttpPut("promijeniLozinku/{userId}")]
public async Task<ActionResult> PromijeniLozinkuAdmin(Guid userId, [FromBody] PromjeniLozinkuDto dto)
{
    if (dto.NovaLozinka != dto.NovaLozinkaPotvrda)
        return BadRequest("Lozinke se ne poklapaju.");

    var korisnik = await context.Korisnici.FirstOrDefaultAsync(k => k.Id == userId);
    if (korisnik == null)
        return NotFound("Korisnik nije pronađen.");

    var hasher = new PasswordHasher<Korisnik>();
    korisnik.PasswordHash = hasher.HashPassword(korisnik, dto.NovaLozinka);
    korisnik.MustChangePassword = false;
    await context.SaveChangesAsync();

    return Ok(new { message = "Lozinka uspješno promijenjena." });
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
