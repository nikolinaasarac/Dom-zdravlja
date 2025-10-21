namespace API.Entities
{
    public class Uputnica
    {
        public int Id { get; set; }

        // Veza ka pacijentu
        public int PacijentId { get; set; }
        public Pacijent Pacijent { get; set; } = null!;

        // Veza ka doktoru
        public int DoktorId { get; set; }
        public Doktor Doktor { get; set; } = null!;

        // Polja specifična za uputnicu
        public required string Dijagnoza { get; set; }
        public required string Opis { get; set; } 
        public required string UpucujeSe { get; set; }

        public DateTime DatumIzdavanja { get; set; } = DateTime.Now;
    }
}
