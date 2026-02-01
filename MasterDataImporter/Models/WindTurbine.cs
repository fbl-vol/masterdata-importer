using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MasterDataImporter.Models;

public class WindTurbine
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Gsrn { get; set; } = string.Empty;

    public DateTime? OriginalConnectionDate { get; set; }

    public DateTime? DecommissioningDate { get; set; }

    public int? CapacityKw { get; set; }

    [Column(TypeName = "decimal(10,2)")]
    public decimal? RotorDiameterM { get; set; }

    [Column(TypeName = "decimal(10,2)")]
    public decimal? HubHeightM { get; set; }

    [MaxLength(200)]
    public string? Manufacturer { get; set; }

    [MaxLength(200)]
    public string? TypeDesignation { get; set; }

    [MaxLength(200)]
    public string? LocalAuthority { get; set; }

    [MaxLength(100)]
    public string? LocationType { get; set; }

    [MaxLength(200)]
    public string? CadastralDistrict { get; set; }

    [MaxLength(100)]
    public string? CadastralNo { get; set; }

    [Column(TypeName = "decimal(12,2)")]
    public decimal? CoordinateX { get; set; }

    [Column(TypeName = "decimal(12,2)")]
    public decimal? CoordinateY { get; set; }

    [MaxLength(200)]
    public string? CoordinateOrigin { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
