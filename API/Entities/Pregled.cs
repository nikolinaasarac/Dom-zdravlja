using System;

namespace API.Entities;

public class Pregled
{
    public int Id { get; set; }

    public DateTime DatumPregleda { get; set; }

    public required string VrstaPregleda { get; set; }

    public string? OpisSimptoma { get; set; }

    public string? Dijagnoza { get; set; }

    public string? Terapija { get; set; }

    public string? Napomena { get; set; }

    public string Status { get; set; } = "zakazan"; // zakazan, obavljen, otkazan

    public int PacijentId { get; set; }
    public Pacijent Pacijent { get; set; } = null!;

    public int DoktorId { get; set; }
    public Doktor Doktor { get; set; } = null!;
    public int ZahtjevZaPregledId { get; set; }
    public ZahtjevZaPregled ZahtjevZaPregled { get; set; } = null!;

}
