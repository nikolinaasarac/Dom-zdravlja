using System;
using API.Data;
using API.DTO;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class DoktoriController(DomZdravljaContext context) : ControllerBase
{
    [HttpGet]
        public async Task<ActionResult<List<DoktorDto>>> GetDoktori()
        {
            var doktori = await context.Doktori
                .Select(d => new DoktorDto
                {
                    Id = d.Id,
                    Ime = d.Ime,
                    Prezime = d.Prezime,
                    Specijalizacija = d.Specijalizacija,
                    BrojLicence = d.BrojLicence,
                    Telefon = d.Telefon,
                    Email = d.Email,
                    Adresa = d.Adresa
                })
                .ToListAsync();

            return doktori;
        }

}
