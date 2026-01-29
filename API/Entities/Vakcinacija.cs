namespace API.Entities;

public class Vakcinacija
{
    public int Id { get; set; }
    public int PacijentId { get; set; }
    public Pacijent Pacijent { get; set; } = null!;
    public required string NazivVakcine { get; set; }
    public required DateOnly DatumPrimanja { get; set; }
    public int Doza { get; set; } 
    public string? Napomena { get; set; }
}
