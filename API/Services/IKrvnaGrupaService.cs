using API.DTO;

public interface IKrvnaGrupaService
    {
        Task<KrvnaGrupaDto?> GetByPacijentIdAsync(int pacijentId);
        Task<KrvnaGrupaDto?> CreateAsync(int pacijentId, KreirajKrvnuGrupuDto dto);
        Task<KrvnaGrupaDto?> UpdateAsync(int id, KreirajKrvnuGrupuDto dto);
        Task<bool> DeleteAsync(int id);
    }

