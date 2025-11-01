namespace API.DTO
{
    public class KreirajZdravstvenoStanjeDto
    {
        public required string Naziv { get; set; }
        public required string Tip { get; set; }
        public required DateTime DatumDijagnoze { get; set; }
        public string? Napomena { get; set; }
    }
}
