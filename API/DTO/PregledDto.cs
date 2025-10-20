using System;

namespace API.DTO;

public class PregledDto
{
    public int Id { get; set; }

    public DateTime DatumPregleda { get; set; }

    public required string VrstaPregleda { get; set; }

    public string? OpisSimptoma { get; set; }

    public string? Dijagnoza { get; set; }

    public string? Terapija { get; set; }

    public string? Napomena { get; set; }

    public string Status { get; set; } = "zakazan"; // zakazan, obavljen, otkazan

    public required string PacijentIme { get; set; }
    public required string PacijentPrezime { get; set; }

    public string? DoktorIme { get; set; }
    public string? DoktorPrezime { get; set; }
}
