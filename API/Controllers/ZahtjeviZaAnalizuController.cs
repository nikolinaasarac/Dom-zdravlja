using System.Security.Claims;
using API.DTO;
using API.Entities;
using API.Services;
using API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ZahtjevZaAnalizuController(IZahtjevAnalizeService service) : ControllerBase
{
    [Authorize(Roles = "Doktor")]
    [HttpPost("pacijent/{pacijentId}")]
    public async Task<IActionResult> KreirajZahtjev(int pacijentId, [FromBody] KreirajZahtjevAnalizuDto dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim == null) return Unauthorized();

        var zahtjev = await service.KreirajZahtjevAsync(pacijentId, dto, Guid.Parse(userIdClaim));
        if (zahtjev == null) return BadRequest("Pacijent ili doktor nisu pronađeni.");

        return Ok(new { message = "Zahtjev uspješno kreiran." });
    }

    [Authorize(Roles = "Doktor")]
    [HttpGet("doktor")]
    public async Task<IActionResult> GetZahtjeviDoktora()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim == null) return Unauthorized();

        var zahtjevi = await service.GetZahtjeviDoktoraAsync(Guid.Parse(userIdClaim));
        return Ok(zahtjevi);
    }

    [Authorize(Roles = "Doktor,Pacijent")]
    [HttpGet("pacijent/{pacijentId}")]
    public async Task<IActionResult> GetZahtjeviPacijenta(int pacijentId)
    {
        var zahtjevi = await service.GetZahtjeviPacijentaAsync(pacijentId);
        return Ok(zahtjevi);
    }

    [Authorize(Roles = "Doktor,Tehnicar,Pacijent")]
    [HttpGet("na-cekanju")]
    public async Task<IActionResult> GetZahtjeviNaCekanju()
    {
        var zahtjevi = await service.GetZahtjeviNaCekanjuAsync();
        return Ok(zahtjevi);
    }

    public class PromjenaStatusaDto { public string? Status { get; set; } }

    [Authorize(Roles = "Tehnicar")]
    [HttpPut("{id}/status")]
    public async Task<IActionResult> PromijeniStatus(int id, [FromBody] PromjenaStatusaDto status)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim == null) return Unauthorized();

        var success = await service.PromijeniStatusAsync(id, status.Status!, Guid.Parse(userIdClaim));
        if (!success) return BadRequest("Nevažeći status ili korisnik nije tehničar.");

        return Ok(new { message = $"Status zahtjeva promijenjen u '{status.Status}'." });
    }

    [Authorize(Roles = "Tehnicar")]
    [HttpPost("{zahtjevId}/zavrsi")]
    public async Task<IActionResult> ZavrsiObraduZahtjeva(int zahtjevId, IFormFile file)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim == null) return Unauthorized();

        var nalaz = await service.ZavrsiZahtjevAsync(zahtjevId, file, Guid.Parse(userIdClaim));
        if (nalaz == null) return BadRequest("Zahtjev nije pronađen ili fajl nije poslan.");

        return Ok(new
        {
            message = "Nalaz uspješno dodan i zahtjev završen.",
            zahtjevId = nalaz.ZahtjevZaAnalizuId,
            nalazFilePath = nalaz.FilePath
        });
    }

    [HttpGet]
    [Authorize(Roles = "Doktor,Tehnicar,Admin")]
    public async Task<IActionResult> GetAllZahtjevi()
    {
        var zahtjevi = await service.GetAllZahtjeviAsync();
        return Ok(zahtjevi);
    }
}
