namespace API.DTO
{
    public class TokenResponseDto
    {
        public required string AccessToken { get; set; }
        public required string RefreshToken { get; set; }
        public required string UserId { get; set; } 
    }
}
