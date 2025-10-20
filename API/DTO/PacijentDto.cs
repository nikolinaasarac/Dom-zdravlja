namespace API.DTO;

public class pacijentDto
{
  public required string Ime { get; set; }
  public required string Prezime { get; set; }
  public DateOnly DatumRodjenja { get; set; }
  public required string Pol { get; set; }
  public required string Adresa { get; set; }
  public required string Telefon { get; set; }
  public required string MaticniBroj { get; set; }
}