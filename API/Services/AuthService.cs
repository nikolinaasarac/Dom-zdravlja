using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.DTO;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace API.Services;

public class AuthService(DomZdravljaContext context, IConfiguration configuration) : IAuthService
{
  public async Task<TokenResponseDto?> LoginAsync(UserDto request)
  {
    var user = await context.Korisnici.FirstOrDefaultAsync(u => u.Username == request.Username);
    if (user is null)
    {
      return null;
    }
    if (new PasswordHasher<Korisnik>().VerifyHashedPassword(user, user.PasswordHash, request.Password)
        == PasswordVerificationResult.Failed)
    {
      return null;
    }

    return await CreateTokenResponse(user);
  }

  private async Task<TokenResponseDto> CreateTokenResponse(Korisnik user)
  {
    return new TokenResponseDto
    {
      AccessToken = CreateToken(user),
      RefreshToken = await GenerateAndSaveRefreshTokenAsync(user),
      UserId = user.Id.ToString()
    };
  }

  public async Task<Korisnik?> RegisterAsync(UserDto request)
  {
    if (await context.Korisnici.AnyAsync(u => u.Username == request.Username))
    {
      return null;
    }

    var user = new Korisnik();
    var hashedPassword = new PasswordHasher<Korisnik>()
        .HashPassword(user, request.Password);

    user.Username = request.Username;
    user.PasswordHash = hashedPassword;
    user.Role = "Admin";

    context.Korisnici.Add(user);
    await context.SaveChangesAsync();

    return user;
  }

  public async Task<TokenResponseDto?> RefreshTokensAsync(string refreshToken)
{
    var user = await context.Korisnici
        .FirstOrDefaultAsync(u => u.RefreshToken == refreshToken && u.RefreshTokenExpiryTime > DateTime.UtcNow);

    if (user is null)
        return null;

    return await CreateTokenResponse(user);
}



  private string GenerateRefreshToken()
  {
    var randomNumber = new byte[32];
    using var rng = RandomNumberGenerator.Create();
    rng.GetBytes(randomNumber);
    return Convert.ToBase64String(randomNumber);
  }

  private async Task<string> GenerateAndSaveRefreshTokenAsync(Korisnik user)
  {
    var refreshToken = GenerateRefreshToken();
    user.RefreshToken = refreshToken;
    user.RefreshTokenExpiryTime = DateTime.UtcNow.AddMinutes(10);
    await context.SaveChangesAsync();
    return refreshToken;
  }

  private string CreateToken(Korisnik user)
  {
    var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Role, user.Role)
        };

    var key = new SymmetricSecurityKey(
        Encoding.UTF8.GetBytes(configuration.GetValue<string>("AppSettings:Token")!));

    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);

    var tokenDescriptor = new JwtSecurityToken(
        issuer: configuration.GetValue<string>("AppSettings:Issuer"),
        audience: configuration.GetValue<string>("AppSettings:Audience"),
        claims: claims,
        expires: DateTime.UtcNow.AddSeconds(15),
        signingCredentials: creds
    );

    return new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);
  }

}
