using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.SignalR;

namespace API.DTO;

public class UpdatePacijentDto : KreirajPacijentaDto
{
  public int Id { get; set; }
}
