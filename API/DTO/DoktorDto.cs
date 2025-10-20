using System;

namespace API.DTO;

public class DoktorDto
{
     public int Id { get; set; }

    public required string Ime { get; set; }

    public required string Prezime { get; set; }

    public required string Specijalizacija { get; set; }

    public required string BrojLicence { get; set; }

    public required string Telefon { get; set; }

    public required string Email { get; set; }

    public required string Adresa { get; set; }
}
