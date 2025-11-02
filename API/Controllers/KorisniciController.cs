using API.DTOs;
using API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class KorisniciController(IKorisnikService service) : ControllerBase
{
    [Authorize]
    [HttpGet("mojNalog")]
    public async Task<ActionResult<object>> GetMyAccount()
    {
        var username = User.Identity?.Name;
        if (username == null) return Unauthorized();
        return await service.GetMyAccount(username);
    }

    [Authorize]
    [HttpPut("promijeniUsername")]
    public async Task<ActionResult> PromijeniUsername([FromBody] UpdateAccountDto dto)
    {
        var trenutniUsername = User.Identity?.Name;
        if (trenutniUsername == null) return Unauthorized();
        return await service.PromijeniUsername(trenutniUsername, dto);
    }

    [Authorize(Roles = "Admin")]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<KorisnikDto>>> GetKorisnickiNalozi()
        => await service.GetKorisnickiNalozi();

    [Authorize(Roles = "Admin")]
    [HttpPost("kreiraj-nalog")]
    public async Task<IActionResult> KreirajNalog(KreirajNalogDto request)
        => await service.KreirajNalog(request);

    [Authorize]
    [HttpPut("promijeniLozinku")]
    public async Task<ActionResult> PromijeniLozinku([FromBody] PromjeniLozinkuDto dto)
    {
        var username = User.Identity?.Name;
        if (username == null) return Unauthorized();
        return await service.PromijeniLozinku(username, dto);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("promijeniLozinku/{userId}")]
    public async Task<ActionResult> PromijeniLozinkuAdmin(Guid userId, [FromBody] PromjeniLozinkuDto dto)
        => await service.PromijeniLozinkuAdmin(userId, dto);

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:Guid}")]
    public async Task<ActionResult> DeleteKorisnik(Guid id)
        => await service.DeleteKorisnik(id);
}
