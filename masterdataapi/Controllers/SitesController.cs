using masterdata_api.Data;
using masterdata_api.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace masterdata_api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SitesController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<SitesController> _logger;

    public SitesController(
        ApplicationDbContext context,
        ILogger<SitesController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Get all sites with pagination
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<SiteDto>>> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 100)
    {
        var sites = await _context.Sites
            .OrderBy(s => s.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(s => new SiteDto
            {
                Id = s.Id,
                Name = s.Name,
                CreatedAt = s.CreatedAt,
                UpdatedAt = s.UpdatedAt,
                TurbineCount = s.WindTurbines.Count
            })
            .ToListAsync();

        return Ok(sites);
    }

    /// <summary>
    /// Get a single site by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<SiteDto>> GetById(int id)
    {
        var site = await _context.Sites
            .Where(s => s.Id == id)
            .Select(s => new SiteDto
            {
                Id = s.Id,
                Name = s.Name,
                CreatedAt = s.CreatedAt,
                UpdatedAt = s.UpdatedAt,
                TurbineCount = s.WindTurbines.Count
            })
            .FirstOrDefaultAsync();

        if (site == null)
        {
            return NotFound(new { error = $"Site with ID {id} not found" });
        }

        return Ok(site);
    }

    /// <summary>
    /// Get all turbines for a specific site
    /// </summary>
    [HttpGet("{id}/turbines")]
    public async Task<ActionResult<SiteDetailDto>> GetSiteWithTurbines(
        int id,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 100)
    {
        var site = await _context.Sites
            .Where(s => s.Id == id)
            .Select(s => new SiteDetailDto
            {
                Id = s.Id,
                Name = s.Name,
                CreatedAt = s.CreatedAt,
                UpdatedAt = s.UpdatedAt,
                Turbines = s.WindTurbines
                    .OrderBy(t => t.Id)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(t => new WindTurbineDto
                    {
                        Id = t.Id,
                        Gsrn = t.Gsrn,
                        OriginalConnectionDate = t.OriginalConnectionDate,
                        DecommissioningDate = t.DecommissioningDate,
                        CapacityKw = t.CapacityKw,
                        RotorDiameterM = t.RotorDiameterM,
                        HubHeightM = t.HubHeightM,
                        Manufacturer = t.Manufacturer,
                        TypeDesignation = t.TypeDesignation,
                        LocalAuthority = t.LocalAuthority,
                        LocationType = t.LocationType,
                        CadastralDistrict = t.CadastralDistrict,
                        CadastralNo = t.CadastralNo,
                        SfeEjendomsnr = t.SfeEjendomsnr,
                        CoordinateX = t.CoordinateX,
                        CoordinateY = t.CoordinateY,
                        CoordinateOrigin = t.CoordinateOrigin,
                        CreatedAt = t.CreatedAt,
                        SiteId = t.SiteId,
                        SiteName = s.Name
                    })
                    .ToList()
            })
            .FirstOrDefaultAsync();

        if (site == null)
        {
            return NotFound(new { error = $"Site with ID {id} not found" });
        }

        return Ok(site);
    }

    /// <summary>
    /// Get statistics about sites
    /// </summary>
    [HttpGet("stats")]
    public async Task<ActionResult> GetStatistics()
    {
        var stats = new
        {
            TotalSites = await _context.Sites.CountAsync(),
            TotalTurbinesWithSite = await _context.WindTurbines.CountAsync(t => t.SiteId != null),
            TotalTurbinesWithoutSite = await _context.WindTurbines.CountAsync(t => t.SiteId == null),
            AverageTurbinesPerSite = await _context.Sites
                .Select(s => s.WindTurbines.Count)
                .DefaultIfEmpty(0)
                .AverageAsync()
        };

        return Ok(stats);
    }
}
