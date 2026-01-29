using System;

namespace API.Entities
{
  public class Recept
  {
    public int Id { get; set; }
    public int PacijentId { get; set; }
    public Pacijent Pacijent { get; set; } = null!;
    public int DoktorId { get; set; }
    public Doktor Doktor { get; set; } = null!;
    public required string NazivLijeka { get; set; }
    public required string Kolicina { get; set; } 
    public required string NacinUzimanja { get; set; } 
    public DateTime DatumIzdavanja { get; set; } = DateTime.Now;
    public string Napomena { get; set; } = string.Empty; 
  }
}
