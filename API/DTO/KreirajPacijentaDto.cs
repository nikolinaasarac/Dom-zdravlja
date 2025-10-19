using System;
using System.ComponentModel.DataAnnotations;

namespace API.DTO;

public class KreirajPacijentaDto
{
  [Required]
  public string Ime { get; set; } = string.Empty;
    [Required]
  public string Prezime { get; set; } = string.Empty;
    [Required]
  public DateOnly DatumRodjenja { get; set; }
    [Required]
  public string Pol { get; set; } = string.Empty;
    [Required]
  public  string Adresa { get; set; } = string.Empty;
    [Required]
  public string Telefon { get; set; } = string.Empty;
    [Required]
  public string MaticniBroj { get; set; } = string.Empty;
}
