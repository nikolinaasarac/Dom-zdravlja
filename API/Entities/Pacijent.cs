namespace API.Entities;

public class Pacijent
{
  public int Id { get; set; }
  public required string Ime { get; set; }
  public required string Prezime { get; set; }
  public DateOnly DatumRodjenja { get; set; }
  public required string Pol { get; set; }
  public required string Adresa { get; set; }
  public required string Telefon { get; set; }

  public ICollection<Vakcinacija>? Vakcinacije { get; set; }
}