using System;
using API.DTO;
using API.DTOs;
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
    CreateMap<KreirajNalogDto, Korisnik>();
  }
}
