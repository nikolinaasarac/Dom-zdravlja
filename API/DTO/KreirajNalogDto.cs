using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class KreirajNalogDto
    {
        [Required]
        public string Username { get; set; } = string.Empty;
        [Required]
        public string Password { get; set; } = string.Empty;
        [Required]
        public string Role { get; set; } = string.Empty;
        public string? MaticniBroj { get; set; } 
    }
}
