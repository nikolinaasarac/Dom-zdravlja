namespace API.Entities;

public class Vakcinacija
{
    public int Id { get; set; }

    // Veza sa pacijentom
    public int PacijentId { get; set; }
    public Pacijent Pacijent { get; set; } = null!;

    // Podaci o vakcini
    public required string NazivVakcine { get; set; }
    public DateOnly DatumPrimanja { get; set; }
    public int Doza { get; set; } // npr. 1, 2, booster
    public string? Napomena { get; set; } = null;
}
