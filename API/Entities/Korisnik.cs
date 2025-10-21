namespace API.Entities
{
    public class Korisnik
    {
        public Guid Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;

        public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();

         public int? DoktorId { get; set; }
        public Doktor? Doktor { get; set; }

        //public int? TehnicarId { get; set; }
        //public Tehnicar? Tehnicar { get; set; }

        public int? PacijentId { get; set; }
        public Pacijent? Pacijent { get; set; }
    }
}
