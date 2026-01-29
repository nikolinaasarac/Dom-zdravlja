using System;

namespace API.Entities;

public class RefreshToken
{
    public int Id { get; set; }             
    public Guid KorisnikId { get; set; }     
    public string Token { get; set; } = string.Empty; 
    public DateTime ExpiresAt { get; set; } 
    public bool Revoked { get; set; } = false; 
    public Korisnik Korisnik { get; set; } = null!;
}
