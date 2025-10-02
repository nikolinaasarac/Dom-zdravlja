public class VakcinacijaDto
{
    public int Id { get; set; }
    public string NazivVakcine { get; set; }
    public DateOnly DatumPrimanja { get; set; }
    public int Doza { get; set; }
    public string Napomena { get; set; }
    public string PacijentIme { get; set; }
    public string PacijentPrezime { get; set; }
}
