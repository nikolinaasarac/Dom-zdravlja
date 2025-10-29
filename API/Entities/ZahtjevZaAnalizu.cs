using API.Entities;

public class ZahtjevZaAnalizu
{
  public int Id { get; set; }

  public int PacijentId { get; set; }
  public required Pacijent Pacijent { get; set; }

  public int DoktorId { get; set; }
  public required Doktor Doktor { get; set; }

  public int? TehnicarId { get; set; }
  public Tehnicar? Tehnicar { get; set; }

  public DateTime DatumZahtjeva { get; set; } = DateTime.Now;

  public required string Opis { get; set; }

  public string Status { get; set; } = "Na čekanju"; // Na čekanju / Prihvaćen / Odbijen
}
