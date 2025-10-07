using System;

namespace API.RequestHelpers;

public class Params:PaginationParams
{
    public string? OrderBy { get; set; }
    public string? SearchTerm { get; set; }
    public string? Pol { get; set; }
}
