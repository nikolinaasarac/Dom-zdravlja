
using API.DTO;
using API.Entities;
using API.Services;
using API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController(IAuthService authService) : ControllerBase
    {
        [HttpPost("login")]
        public async Task<IActionResult> Login(UserDto request)
        {
            var result = await authService.LoginAsync(request);
            if (result is null)
                return BadRequest("Pogrešno korisničko ime ili lozinka.");

            Response.Cookies.Append("refreshToken", result.RefreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddDays(7)
            });

            return Ok(new TokenResponseDto
            {
                AccessToken = result.AccessToken,
                RefreshToken = "", // ne vraćamo ga na front
                UserId = result.UserId,
                MustChangePassword = result.MustChangePassword // ✅ proslijedimo
            });
        }

        [HttpPost("refresh-token")]
        public async Task<ActionResult<TokenResponseDto>> RefreshToken()
        {
            // ✅ Uzimamo refresh token iz cookie-a
            var refreshToken = Request.Cookies["refreshToken"];
            if (string.IsNullOrEmpty(refreshToken))
                return Unauthorized("No refresh token found.");

            var result = await authService.RefreshTokensAsync(refreshToken);
            if (result is null)
                return Unauthorized("Invalid refresh token.");

            Console.WriteLine("RefreshToken endpoint - new access token: " + result.AccessToken);
            // ✅ Osveži cookie sa novim tokenom
            Response.Cookies.Append("refreshToken", result.RefreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddDays(7)
            });

            return Ok(new TokenResponseDto
            {
                AccessToken = result.AccessToken,
                RefreshToken = "",
                UserId = result.UserId
            });
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            var refreshToken = Request.Cookies["refreshToken"];
            if (string.IsNullOrEmpty(refreshToken))
                return BadRequest("No refresh token found.");

            var success = await authService.LogoutAsync(refreshToken);
            if (!success)
                return NotFound("Refresh token not found.");

            // 🔹 Obriši cookie
            Response.Cookies.Delete("refreshToken", new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict
            });

            return Ok(new { message = "Logged out successfully." }
        );
        }
    }
}
