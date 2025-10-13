using System;

namespace API.Entities;

public class RefreshToken
{
    public int Id { get; set; }               // Primarni ključ
    public Guid KorisnikId { get; set; }      // FK prema korisniku
    public string Token { get; set; } = string.Empty; // Nasumični refresh token
    public DateTime ExpiresAt { get; set; }   // Vrijeme isteka
    public bool Revoked { get; set; } = false; // Ako je token opozvan
    // Navigaciona svojstva
    public Korisnik Korisnik { get; set; } = null!;
}
