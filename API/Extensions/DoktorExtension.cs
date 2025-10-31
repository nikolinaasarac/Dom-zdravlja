using System;
using API.Entities;

namespace API.Extensions
{
    public static class DoktorExtension
    {
        public static IQueryable<Doktor> Sort(this IQueryable<Doktor> query, string? orderBy)
        {
            query = orderBy switch
            {
                "ime" => query.OrderBy(x => x.Ime),
                "prezime" => query.OrderBy(x => x.Prezime),
                _ => query.OrderBy(x => x.Specijalizacija)
            };
            return query;
        }

        public static IQueryable<Doktor> Search(this IQueryable<Doktor> query, string? searchTerm)
        {
            if (string.IsNullOrEmpty(searchTerm)) return query;

            var lowerCaseSearchTerm = searchTerm.ToLower();

            return query.Where(x =>
                (x.Ime + " " + x.Prezime).ToLower().Contains(lowerCaseSearchTerm) ||
                (x.Prezime + " " + x.Ime).ToLower().Contains(lowerCaseSearchTerm) ||
                x.Specijalizacija.ToLower().Contains(lowerCaseSearchTerm)
            );
        }
    }
}
