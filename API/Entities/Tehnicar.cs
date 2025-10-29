namespace API.Entities;

public class Tehnicar
{
  public int Id { get; set; }

  public required string Ime { get; set; }

  public required string Prezime { get; set; }

  public required string Telefon { get; set; }

  public required string Email { get; set; }

  public required string Adresa { get; set; }

  public ICollection<ZahtjevZaAnalizu>? ZahtjeviZaAnalizu { get; set; }
  public ICollection<Nalaz>? Nalazi { get; set; }

}
