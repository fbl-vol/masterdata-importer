using masterdata_api.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using masterdata_api.DTOs;
using masterdata_api.Services;

namespace masterdata_api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WindTurbinesController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ExcelImportService _importService;
    private readonly ILogger<WindTurbinesController> _logger;

    public WindTurbinesController(
        ApplicationDbContext context,
        ExcelImportService importService,
        ILogger<WindTurbinesController> logger)
    {
        _context = context;
        _importService = importService;
        _logger = logger;
    }

    /// <summary>
    /// Import wind turbine data from an Excel file
    /// </summary>
    [HttpPost("import")]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<ImportResultDto>> ImportData([FromForm] IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest(new { error = "No file uploaded" });
        }

        if (!file.FileName.EndsWith(".xlsx", StringComparison.OrdinalIgnoreCase))
        {
            return BadRequest(new { error = "File must be an Excel file (.xlsx)" });
        }

        using var stream = file.OpenReadStream();
        var result = await _importService.ImportFromExcelAsync(stream);

        return Ok(result);
    }

    /// <summary>
    /// Get all wind turbines with pagination
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<WindTurbineDto>>> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 100)
    {
        var turbines = await _context.WindTurbines
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
                CoordinateX = t.CoordinateX,
                CoordinateY = t.CoordinateY,
                CoordinateOrigin = t.CoordinateOrigin,
                CreatedAt = t.CreatedAt
            })
            .ToListAsync();

        return Ok(turbines);
    }

    /// <summary>
    /// Get a single wind turbine by GSRN number
    /// </summary>
    [HttpGet("gsrn/{gsrn}")]
    public async Task<ActionResult<WindTurbineDto>> GetByGsrn(string gsrn)
    {
        var turbine = await _context.WindTurbines
            .Where(t => t.Gsrn == gsrn)
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
                CoordinateX = t.CoordinateX,
                CoordinateY = t.CoordinateY,
                CoordinateOrigin = t.CoordinateOrigin,
                CreatedAt = t.CreatedAt
            })
            .FirstOrDefaultAsync();

        if (turbine == null)
        {
            return NotFound(new { error = $"Wind turbine with GSRN {gsrn} not found" });
        }

        return Ok(turbine);
    }

    /// <summary>
    /// Get multiple wind turbines by a list of GSRN numbers
    /// </summary>
    [HttpPost("gsrn/batch")]
    public async Task<ActionResult<IEnumerable<WindTurbineDto>>> GetByGsrnList([FromBody] List<string> gsrnList)
    {
        if (gsrnList == null || !gsrnList.Any())
        {
            return BadRequest(new { error = "GSRN list cannot be empty" });
        }

        var turbines = await _context.WindTurbines
            .Where(t => gsrnList.Contains(t.Gsrn))
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
                CoordinateX = t.CoordinateX,
                CoordinateY = t.CoordinateY,
                CoordinateOrigin = t.CoordinateOrigin,
                CreatedAt = t.CreatedAt
            })
            .ToListAsync();

        return Ok(turbines);
    }

    /// <summary>
    /// Get wind turbines by model type (type designation)
    /// </summary>
    [HttpGet("model/{modelType}")]
    public async Task<ActionResult<IEnumerable<WindTurbineDto>>> GetByModelType(
        string modelType,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 100)
    {
        var turbines = await _context.WindTurbines
            .Where(t => t.TypeDesignation != null && 
                   t.TypeDesignation.Contains(modelType))
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
                CoordinateX = t.CoordinateX,
                CoordinateY = t.CoordinateY,
                CoordinateOrigin = t.CoordinateOrigin,
                CreatedAt = t.CreatedAt
            })
            .ToListAsync();

        return Ok(turbines);
    }

    /// <summary>
    /// Get wind turbines by manufacturer/producer
    /// </summary>
    [HttpGet("manufacturer/{manufacturer}")]
    public async Task<ActionResult<IEnumerable<WindTurbineDto>>> GetByManufacturer(
        string manufacturer,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 100)
    {
        var turbines = await _context.WindTurbines
            .Where(t => t.Manufacturer != null && 
                   t.Manufacturer.Contains(manufacturer))
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
                CoordinateX = t.CoordinateX,
                CoordinateY = t.CoordinateY,
                CoordinateOrigin = t.CoordinateOrigin,
                CreatedAt = t.CreatedAt
            })
            .ToListAsync();

        return Ok(turbines);
    }

    /// <summary>
    /// Get statistics about the database
    /// </summary>
    [HttpGet("stats")]
    public async Task<ActionResult> GetStatistics()
    {
        var stats = new
        {
            TotalTurbines = await _context.WindTurbines.CountAsync(),
            Manufacturers = await _context.WindTurbines
                .Where(t => t.Manufacturer != null)
                .Select(t => t.Manufacturer)
                .Distinct()
                .CountAsync(),
            ModelTypes = await _context.WindTurbines
                .Where(t => t.TypeDesignation != null)
                .Select(t => t.TypeDesignation)
                .Distinct()
                .CountAsync()
        };

        return Ok(stats);
    }
}
