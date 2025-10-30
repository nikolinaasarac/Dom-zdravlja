using API.DTO;

public class LoginResult
{
    public bool Success { get; set; }
    public bool MustChangePassword { get; set; }
    public TokenResponseDto? TokenResponse { get; set; }
    public string? Message { get; set; }
    public Guid? KorisnikId { get; set; }
}
