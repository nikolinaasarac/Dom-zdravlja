using System;

namespace API.DTO;

public class TehnicarDto
{
    public int Id { get; set; }

    public required string Ime { get; set; }

    public required string Prezime { get; set; }

    public required string Telefon { get; set; }

    public required string Email { get; set; }

    public required string Adresa { get; set; }
}
