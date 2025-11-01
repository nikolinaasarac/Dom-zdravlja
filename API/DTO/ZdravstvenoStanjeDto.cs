using System;

namespace API.DTO;

public class ZdravstvenoStanjeDto
{
    public int Id { get; set; }
    public required string Naziv { get; set; }
    public required string Tip { get; set; }
    public required DateTime DatumDijagnoze { get; set; }
    public string? Napomena { get; set; }
}
