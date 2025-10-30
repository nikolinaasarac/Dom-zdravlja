using API.Data;
using API.DTO;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class NalaziController(DomZdravljaContext context) : ControllerBase
  {
    // GET: api/Nalazi/pacijent/5
    [HttpGet("pacijent/{pacijentId}")]
    public async Task<ActionResult<List<NalazDto>>> GetNalaziZaPacijenta(int pacijentId)
    {
      var nalazi = await context.Nalazi
          .Include(n => n.Pacijent)
          .Include(n => n.Tehnicar)
          .Where(n => n.PacijentId == pacijentId)
          .Select(n => new NalazDto
          {
            Id = n.Id,
            PacijentId = n.PacijentId,
            TehnicarId = n.TehnicarId,
            FilePath = n.FilePath ?? string.Empty,
            DatumDodavanja = n.DatumDodavanja,
            PacijentIme = n.Pacijent.Ime,
            PacijentPrezime = n.Pacijent.Prezime,
            TehnicarIme = n.Tehnicar != null ? n.Tehnicar.Ime : null,
            TehnicarPrezime = n.Tehnicar != null ? n.Tehnicar.Prezime : null
          })
          .ToListAsync();

      if (nalazi.Count == 0)
        return NotFound("Nema nalaza za izabranog pacijenta.");

      return Ok(nalazi);
    }

    // GET: api/Nalazi
    [HttpGet]
    public async Task<ActionResult<List<NalazDto>>> GetSviNalazi()
    {
      var nalazi = await context.Nalazi
          .Include(n => n.Pacijent)
          .Include(n => n.Tehnicar)
          .Select(n => new NalazDto
          {
            Id = n.Id,
            PacijentId = n.PacijentId,
            TehnicarId = n.TehnicarId,
            FilePath = n.FilePath ?? string.Empty,
            DatumDodavanja = n.DatumDodavanja,
            PacijentIme = n.Pacijent.Ime,
            PacijentPrezime = n.Pacijent.Prezime,
            TehnicarIme = n.Tehnicar != null ? n.Tehnicar.Ime : null,
            TehnicarPrezime = n.Tehnicar != null ? n.Tehnicar.Prezime : null
          })
          .ToListAsync();

      return Ok(nalazi);
    }

    // GET: api/Nalazi/{id}/pdf
    [HttpGet("{id}/pdf")]
    public async Task<IActionResult> GetPdf(int id)
    {
      var nalaz = await context.Nalazi.FindAsync(id);
      if (nalaz == null || string.IsNullOrEmpty(nalaz.FilePath))
        return NotFound("Nalaz nije pronađen.");

      var filePath = Path.Combine("wwwroot", nalaz.FilePath);
      if (!System.IO.File.Exists(filePath))
        return NotFound("PDF fajl ne postoji.");

      var memory = new MemoryStream();
      using (var stream = new FileStream(filePath, FileMode.Open))
      {
        await stream.CopyToAsync(memory);
      }
      memory.Position = 0;
      return File(memory, "application/pdf", Path.GetFileName(filePath));
    }



    // GET: api/Nalazi/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<NalazDto>> GetNalazById(int id)
    {
      var nalaz = await context.Nalazi
          .Include(n => n.Pacijent)
          .Include(n => n.Tehnicar)
          .FirstOrDefaultAsync(n => n.Id == id);

      if (nalaz == null)
        return NotFound("Nalaz nije pronađen.");

      var result = new NalazDto
      {
        Id = nalaz.Id,
        PacijentId = nalaz.PacijentId,
        TehnicarId = nalaz.TehnicarId,
        FilePath = nalaz.FilePath ?? string.Empty,
        DatumDodavanja = nalaz.DatumDodavanja,
        PacijentIme = nalaz.Pacijent.Ime,
        PacijentPrezime = nalaz.Pacijent.Prezime,
        TehnicarIme = nalaz.Tehnicar?.Ime,
        TehnicarPrezime = nalaz.Tehnicar?.Prezime
      };

      return Ok(result);
    }

  }

}
