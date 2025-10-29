using System;

namespace API.DTO;

public class NalazDto
{
    public int Id { get; set; }
    public int PacijentId { get; set; }
    public int? TehnicarId { get; set; }

    public required string FilePath { get; set; } 
    public DateTime DatumDodavanja { get; set; }

    public string PacijentIme { get; set; } = string.Empty;
    public string PacijentPrezime { get; set; } = string.Empty;

    public string? TehnicarIme { get; set; }
    public string? TehnicarPrezime { get; set; }
}
