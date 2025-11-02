using API.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace API.Services.Interfaces
{
    public interface IKorisnikService
    {
        Task<ActionResult<object>> GetMyAccount(string username);
        Task<ActionResult> PromijeniUsername(string trenutniUsername, UpdateAccountDto dto);
        Task<ActionResult<IEnumerable<KorisnikDto>>> GetKorisnickiNalozi();
        Task<IActionResult> KreirajNalog(KreirajNalogDto request);
        Task<ActionResult> PromijeniLozinku(string username, PromjeniLozinkuDto dto);
        Task<ActionResult> PromijeniLozinkuAdmin(Guid userId, PromjeniLozinkuDto dto);
        Task<ActionResult> DeleteKorisnik(Guid id);
    }
}
