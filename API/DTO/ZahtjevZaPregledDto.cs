namespace API.DTOs
{
    public class ZahtjevZaPregledDto
    {
        public int Id { get; set; }
        public DateTime DatumZahtjeva { get; set; }
        public string Opis { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;

        public string PacijentIme { get; set; } = string.Empty;
        public string PacijentPrezime { get; set; } = string.Empty;

        public string DoktorIme { get; set; } = string.Empty;
        public string DoktorPrezime { get; set; } = string.Empty;
    }
}
