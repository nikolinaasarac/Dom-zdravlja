using System;
using API.DTO;
using API.Entities;
using AutoMapper;

namespace API.RequestHelpers;

public class MappingProfiles : Profile
{
  public MappingProfiles()
  {
    CreateMap<KreirajPacijentaDto, Pacijent>();
    CreateMap<UpdatePacijentDto, Pacijent>();
    CreateMap<UpdatePregledDto, Pregled>();

  }
}
