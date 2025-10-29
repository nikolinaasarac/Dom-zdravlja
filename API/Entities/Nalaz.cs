using API.Entities;

public class Nalaz
{
  public int Id { get; set; }
  public int ZahtjevZaAnalizuId { get; set; }
  public required ZahtjevZaAnalizu ZahtjevZaAnalizu { get; set; }
  public int PacijentId { get; set; }
  public required Pacijent Pacijent { get; set; }

  public int? TehnicarId { get; set; }
  public Tehnicar? Tehnicar { get; set; }

  public string? FilePath { get; set; }   // npr. "uploads/nalozi/nalaz_1234.pdf"
  public DateTime DatumDodavanja { get; set; } = DateTime.Now;
}
