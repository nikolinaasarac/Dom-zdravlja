using System;

namespace API.Entities;

public class ZdravstvenoStanje
{
    public int Id { get; set; }
    public required string Naziv { get; set; }
    public required string Tip { get; set; }
    public required DateTime DatumDijagnoze { get; set; }
    public string? Napomena { get; set; }
    public int PacijentId { get; set; }
    public Pacijent Pacijent { get; set; } = null!;
}
