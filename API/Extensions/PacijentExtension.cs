using API.Entities;

namespace API.Extensions;

public static class PacijentExtension
{
    public static IQueryable<Pacijent> Filter(this IQueryable<Pacijent> query,
        string? pol)
        {
            var polList = new List<string>();

            if (!string.IsNullOrEmpty(pol))
            {
                polList.AddRange([.. pol.Split(',')]);
            }
            query = query.Where(x => polList.Count == 0 || polList.Contains(x.Pol));

            return query;
        }
}