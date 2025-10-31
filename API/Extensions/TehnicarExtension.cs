using System;
using API.Entities;

namespace API.Extensions
{
    public static class TehnicarExtension
    {
        public static IQueryable<Tehnicar> Sort(this IQueryable<Tehnicar> query, string? orderBy)
        {
            query = orderBy switch
            {
                "ime" => query.OrderBy(x => x.Ime),
                "prezime" => query.OrderBy(x => x.Prezime),
                _ => query.OrderBy(x => x.Prezime)
            };
            return query;
        }

        public static IQueryable<Tehnicar> Search(this IQueryable<Tehnicar> query, string? searchTerm)
        {
            if (string.IsNullOrEmpty(searchTerm)) return query;

            var lowerCaseTerm = searchTerm.ToLower();

            return query.Where(x =>
                (x.Ime + " " + x.Prezime).ToLower().Contains(lowerCaseTerm) ||
                (x.Prezime + " " + x.Ime).ToLower().Contains(lowerCaseTerm) ||
                x.MaticniBroj.ToLower().Contains(lowerCaseTerm)
            );
        }
    }
}
