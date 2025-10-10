using System;
using API.DTO;
using API.Entities;

namespace API.Services;

public interface IAuthService
{
    Task<Korisnik?> RegisterAsync(UserDto request);
    Task<TokenResponseDto?> LoginAsync(UserDto request);
    Task<TokenResponseDto?> RefreshTokensAsync(RefreshTokenRequestDto request);
}