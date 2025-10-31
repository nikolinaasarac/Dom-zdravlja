using System;

namespace API.Entities
{
  public class Recept
  {
    public int Id { get; set; }

    // Povezanost sa pacijentom
    public int PacijentId { get; set; }
    public Pacijent Pacijent { get; set; } = null!;

    // Povezanost sa ljekarom
    public int DoktorId { get; set; }
    public Doktor Doktor { get; set; } = null!;

    // Podaci o lijeku
    public required string NazivLijeka { get; set; }
    public required string Kolicina { get; set; } 
    public required string NacinUzimanja { get; set; } 

    // Dodatne informacije o uputnici
    public DateTime DatumIzdavanja { get; set; } = DateTime.Now;
    public string Napomena { get; set; } = string.Empty; // opcionalno
  }
}
