namespace masterdata_api.DTOs;

public class WindTurbineDto
{
    public int Id { get; set; }
    public string Gsrn { get; set; } = string.Empty;
    public DateTime? OriginalConnectionDate { get; set; }
    public DateTime? DecommissioningDate { get; set; }
    public int? CapacityKw { get; set; }
    public decimal? RotorDiameterM { get; set; }
    public decimal? HubHeightM { get; set; }
    public string? Manufacturer { get; set; }
    public string? TypeDesignation { get; set; }
    public string? LocalAuthority { get; set; }
    public string? LocationType { get; set; }
    public string? CadastralDistrict { get; set; }
    public string? CadastralNo { get; set; }
    public decimal? CoordinateX { get; set; }
    public decimal? CoordinateY { get; set; }
    public string? CoordinateOrigin { get; set; }
    public DateTime CreatedAt { get; set; }
    public int? SiteId { get; set; }
    public string? SiteName { get; set; }
}

public class ImportResultDto
{
    public int ImportedCount { get; set; }
    public int UpdatedCount { get; set; }
    public int TotalCount { get; set; }
    public List<string> Errors { get; set; } = new();
}
