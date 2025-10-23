namespace API.DTOs
{
    public class KreirajZahtjevDto
    {
        public int PacijentId { get; set; }
        public int DoktorId { get; set; }
        public string Opis { get; set; } = string.Empty;
    }
}
