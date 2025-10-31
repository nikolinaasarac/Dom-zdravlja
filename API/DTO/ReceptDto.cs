namespace API.DTOs
{
    public class ReceptDto
    {
        public string NazivLijeka { get; set; } = string.Empty;
        public string Kolicina { get; set; } = string.Empty;
        public string NacinUzimanja { get; set; } = string.Empty;

        // Opcionalno
        public string Napomena { get; set; } = string.Empty;
    }
}
