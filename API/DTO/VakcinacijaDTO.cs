public class VakcinacijaDto
{
    public int Id { get; set; }
    public required string NazivVakcine { get; set; }
    public DateOnly DatumPrimanja { get; set; }
    public int Doza { get; set; }
    public string? Napomena { get; set; }
    public required string PacijentIme { get; set; }
    public required string PacijentPrezime { get; set; }
}
