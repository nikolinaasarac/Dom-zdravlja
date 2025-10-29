namespace API.Entities;

public class Doktor
{
    public int Id { get; set; }

    public required string Ime { get; set; }

    public required string Prezime { get; set; }

    public required string MaticniBroj { get; set; }

    public required string Specijalizacija { get; set; }

    public required string BrojLicence { get; set; }

    public required string Telefon { get; set; }

    public required string Email { get; set; }

    public required string Adresa { get; set; }

    //svi pregledi koje je doktor obavio
    public ICollection<Pregled>? Pregledi { get; set; }
    public ICollection<ZahtjevZaPregled>? ZahtjeviZaPregled { get; set; }
    public ICollection<ZahtjevZaAnalizu>? ZahtjeviZaAnalize { get; set; }
}
