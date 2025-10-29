namespace API.DTO;

public class ZahtjevZaAnalizuDto
{
    public int Id { get; set; }
    public int PacijentId { get; set; }
    public required string PacijentIme { get; set; }
    public required string PacijentPrezime { get; set; }

    public int DoktorId { get; set; }
    public required string DoktorIme { get; set; }
    public required string DoktorPrezime { get; set; }

    public int? TehnicarId { get; set; }
    public string? TehnicarIme { get; set; }
    public string? TehnicarPrezime { get; set; }

    public required string Opis { get; set; }
    public required string Status { get; set; }
    public DateTime DatumZahtjeva { get; set; }
}
