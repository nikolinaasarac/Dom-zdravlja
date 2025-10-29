namespace API.DTOs
{
    public class KorisnikDto
    {
        public Guid Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string? Ime { get; set; }
        public string? Prezime { get; set; }
    }
}
