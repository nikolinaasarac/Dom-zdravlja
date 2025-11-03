using API.Data;
using API.DTOs;
using API.Entities;
using API.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Services.Implementations
{
    public class KorisnikService(DomZdravljaContext context) : IKorisnikService
    {
        public async Task<ActionResult<object>> GetMyAccount(string username)
        {
            var korisnik = await context.Korisnici
                .Include(k => k.Doktor)
                .Include(k => k.Pacijent)
                .Include(k => k.Tehnicar)
                .FirstOrDefaultAsync(k => k.Username == username);

            if (korisnik == null) return new NotFoundResult();

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
                } : null,
                Tehnicar = korisnik.Tehnicar != null ? new
                {
                    korisnik.Tehnicar.Ime,
                    korisnik.Tehnicar.Prezime,
                    korisnik.Tehnicar.Telefon,
                    korisnik.Tehnicar.Email,
                    korisnik.Tehnicar.Adresa,
                } : null,
            };
        }

        public async Task<ActionResult> PromijeniUsername(string trenutniUsername, UpdateAccountDto dto)
        {
            if (await context.Korisnici.AnyAsync(k => k.Username == dto.Username))
                return new BadRequestObjectResult(new { message = "Korisničko ime već postoji." });

            var korisnik = await context.Korisnici.FirstOrDefaultAsync(k => k.Username == trenutniUsername);
            if (korisnik == null)
                return new NotFoundResult();

            korisnik.Username = dto.Username;
            await context.SaveChangesAsync();

            return new OkObjectResult(new { message = "Korisničko ime je uspješno promijenjeno.", dto.Username });
        }

        public async Task<ActionResult<IEnumerable<KorisnikDto>>> GetKorisnickiNalozi()
        {
            var korisnici = await context.Korisnici
                .Include(k => k.Doktor)
                .Include(k => k.Pacijent)
                .Include(k => k.Tehnicar)
                .Select(k => new KorisnikDto
                {
                    Id = k.Id,
                    Username = k.Username,
                    Role = k.Role,
                    Ime = k.Doktor != null ? k.Doktor.Ime :
                          k.Pacijent != null ? k.Pacijent.Ime :
                          k.Tehnicar != null ? k.Tehnicar.Ime : null,
                    Prezime = k.Doktor != null ? k.Doktor.Prezime :
                              k.Pacijent != null ? k.Pacijent.Prezime :
                              k.Tehnicar != null ? k.Tehnicar.Prezime : null
                })
                .ToListAsync();

            return new OkObjectResult(korisnici);
        }

        public async Task<IActionResult> KreirajNalog(KreirajNalogDto request)
        {
            if (await context.Korisnici.AnyAsync(u => u.Username == request.Username))
                return new BadRequestObjectResult("Postoji korisnik sa tim korisničkim imenom");

            var user = new Korisnik();
            var hasher = new PasswordHasher<Korisnik>();
            user.PasswordHash = hasher.HashPassword(user, request.Password);
            user.Username = request.Username;
            user.Role = request.Role;

            if (request.Role == "Admin")
            {
                user.MustChangePassword = true;
                context.Korisnici.Add(user);
                await context.SaveChangesAsync();
                return new OkObjectResult(user);
            }

            if (string.IsNullOrEmpty(request.MaticniBroj))
                throw new Exception("Matični broj je obavezan za ovu ulogu.");

            if (request.Role == "Doktor")
            {
                var doktor = await context.Doktori.FirstOrDefaultAsync(d => d.MaticniBroj == request.MaticniBroj);
                if (doktor == null) return new BadRequestObjectResult("Doktor sa unesenim matičnim brojem ne postoji.");

                if (await context.Korisnici.AnyAsync(k => k.DoktorId == doktor.Id))
                    return new BadRequestObjectResult("Već postoji aktivan nalog za ovog doktora.");

                user.DoktorId = doktor.Id;
            }
            else if (request.Role == "Pacijent")
            {
                var pacijent = await context.Pacijenti.FirstOrDefaultAsync(p => p.MaticniBroj == request.MaticniBroj);
                if (pacijent == null) return new BadRequestObjectResult("Pacijent sa unesenim matičnim brojem ne postoji.");

                if (await context.Korisnici.AnyAsync(k => k.PacijentId == pacijent.Id))
                    return new BadRequestObjectResult("Već postoji aktivan nalog za ovog pacijenta.");

                user.PacijentId = pacijent.Id;
            }
            else if (request.Role == "Tehnicar")
            {
                var tehnicar = await context.Tehnicari.FirstOrDefaultAsync(t => t.MaticniBroj == request.MaticniBroj);
                if (tehnicar == null) return new BadRequestObjectResult("Tehničar sa unesenim matičnim brojem ne postoji.");

                if (await context.Korisnici.AnyAsync(k => k.TehnicarId == tehnicar.Id))
                    return new BadRequestObjectResult("Već postoji aktivan nalog za ovog tehničara.");

                user.TehnicarId = tehnicar.Id;
            }

            user.MustChangePassword = true;
            context.Korisnici.Add(user);
            await context.SaveChangesAsync();

            return new OkObjectResult(user);
        }

        public async Task<ActionResult> PromijeniLozinku(string username, PromjeniLozinkuDto dto)
        {
            if (dto.NovaLozinka != dto.NovaLozinkaPotvrda)
                return new BadRequestObjectResult("Lozinke se ne poklapaju.");

            var korisnik = await context.Korisnici.FirstOrDefaultAsync(k => k.Username == username);
            if (korisnik == null)
                return new NotFoundObjectResult("Korisnik nije pronađen.");

            var hasher = new PasswordHasher<Korisnik>();
            korisnik.PasswordHash = hasher.HashPassword(korisnik, dto.NovaLozinka);
            korisnik.MustChangePassword = false;
            await context.SaveChangesAsync();

            return new OkObjectResult(new { message = "Lozinka uspješno promijenjena." });
        }

        public async Task<ActionResult> PromijeniLozinkuAdmin(Guid userId, PromjeniLozinkuDto dto)
        {
            if (dto.NovaLozinka != dto.NovaLozinkaPotvrda)
                return new BadRequestObjectResult("Lozinke se ne poklapaju.");

            var korisnik = await context.Korisnici.FirstOrDefaultAsync(k => k.Id == userId);
            if (korisnik == null)
                return new NotFoundObjectResult("Korisnik nije pronađen.");

            var hasher = new PasswordHasher<Korisnik>();
            korisnik.PasswordHash = hasher.HashPassword(korisnik, dto.NovaLozinka);
            korisnik.MustChangePassword = true;
            await context.SaveChangesAsync();

            return new OkObjectResult(new { message = "Lozinka uspješno promijenjena." });
        }

        public async Task<ActionResult> DeleteKorisnik(Guid id)
        {
            var korisnik = await context.Korisnici.FindAsync(id);
            if (korisnik == null) return new NotFoundResult();

            context.Korisnici.Remove(korisnik);
            var success = await context.SaveChangesAsync() > 0;
            if (!success) return new BadRequestResult();

            return new OkResult();
        }
    }
}
