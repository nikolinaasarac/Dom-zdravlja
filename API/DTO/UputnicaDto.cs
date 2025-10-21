namespace API.DTOs
{
    public class UputnicaDto
    {
        public string Dijagnoza { get; set; } = string.Empty;
        public string Opis { get; set; } = string.Empty;
        public string UpucujeSe { get; set; } = string.Empty;

        // Za sada mozemo dodati doktorId ako ne koristimo token
        public int DoktorId { get; set; }
    }
}
