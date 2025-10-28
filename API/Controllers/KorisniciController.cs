using System;
using API.Data;
using Microsoft.AspNetCore.Authorization;
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
}
