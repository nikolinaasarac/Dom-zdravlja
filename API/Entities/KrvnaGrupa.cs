using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    public class KrvnaGrupa
    {
        public int Id { get; set; }
        public int PacijentId { get; set; }  
         public Pacijent Pacijent { get; set; } = null!;
        [MaxLength(2)]
        public required string Grupa { get; set; } 
        [MaxLength(1)]
        public required string Faktor { get; set; } 
    }
}
