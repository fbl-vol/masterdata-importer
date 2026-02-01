using OfficeOpenXml;
using MasterDataImporter.Models;
using MasterDataImporter.Data;
using MasterDataImporter.DTOs;
using Microsoft.EntityFrameworkCore;

namespace MasterDataImporter.Services;

public class ExcelImportService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<ExcelImportService> _logger;

    // Danish to English column name mapping
    private static readonly Dictionary<string, string> ColumnMapping = new()
    {
        { "Møllenummer (GSRN)", "Gsrn" },
        { "Dato for oprindelig nettilslutning", "OriginalConnectionDate" },
        { "Dato for afmeldning", "DecommissioningDate" },
        { "Kapacitet (kW)", "CapacityKw" },
        { "Rotor-diameter (m)", "RotorDiameterM" },
        { "Navhøjde (m)", "HubHeightM" },
        { "Fabrikat", "Manufacturer" },
        { "Typebetegnelse", "TypeDesignation" },
        { "Kommune", "LocalAuthority" },
        { "Type af placering", "LocationType" },
        {"X (øst) koordinat \nUTM 32 Euref89", "EastCoordinate" },
        {"Y (nord) koordinat \nUTM 32 Euref89", "NorthCoordinate" }
    };

    public ExcelImportService(ApplicationDbContext context, ILogger<ExcelImportService> logger)
    {
        _context = context;
        _logger = logger;
        ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
    }

    public async Task<ImportResultDto> ImportFromExcelAsync(Stream excelStream)
    {
        var result = new ImportResultDto();

        try
        {
            using var package = new ExcelPackage(excelStream);
            var worksheet = package.Workbook.Worksheets[0];

            if (worksheet == null)
            {
                result.Errors.Add("No worksheet found in Excel file");
                return result;
            }

            // Find the header row (row 7 in the original file, 0-based is 6)
            int headerRow = FindHeaderRow(worksheet);
            if (headerRow == -1)
            {
                result.Errors.Add("Could not find header row in Excel file");
                return result;
            }

            var headers = new Dictionary<int, string>();
            for (int col = 1; col <= worksheet.Dimension.Columns; col++)
            {
                var headerValue = worksheet.Cells[headerRow, col].Text;
                if (!string.IsNullOrWhiteSpace(headerValue))
                {
                    headers[col] = headerValue;
                }
            }

            // Find column indices
            var columnIndices = MapColumns(headers);

            // Track seen GSRNs to avoid duplicates within the file
            var seenGsrns = new HashSet<string>();

            // Read data rows
            for (int row = headerRow + 1; row <= worksheet.Dimension.Rows; row++)
            {
                try
                {
                    var gsrn = GetCellValue(worksheet, row, columnIndices.GetValueOrDefault("Gsrn", -1));
                    
                    // Skip rows without GSRN or with invalid GSRN
                    if (string.IsNullOrWhiteSpace(gsrn) || !IsNumeric(gsrn))
                        continue;

                    // Skip duplicates within the file (take the first occurrence)
                    if (seenGsrns.Contains(gsrn))
                        continue;
                    
                    seenGsrns.Add(gsrn);

                    var existingTurbine = await _context.WindTurbines
                        .FirstOrDefaultAsync(t => t.Gsrn == gsrn);

                    var turbine = existingTurbine ?? new WindTurbine();
                    
                    turbine.Gsrn = gsrn;
                    turbine.OriginalConnectionDate = ParseDate(GetCellValue(worksheet, row, columnIndices.GetValueOrDefault("OriginalConnectionDate", -1)));
                    turbine.DecommissioningDate = ParseDate(GetCellValue(worksheet, row, columnIndices.GetValueOrDefault("DecommissioningDate", -1)));
                    turbine.CapacityKw = ParseInt(GetCellValue(worksheet, row, columnIndices.GetValueOrDefault("CapacityKw", -1)));
                    turbine.RotorDiameterM = ParseDecimal(GetCellValue(worksheet, row, columnIndices.GetValueOrDefault("RotorDiameterM", -1)));
                    turbine.HubHeightM = ParseDecimal(GetCellValue(worksheet, row, columnIndices.GetValueOrDefault("HubHeightM", -1)));
                    turbine.Manufacturer = GetCellValue(worksheet, row, columnIndices.GetValueOrDefault("Manufacturer", -1));
                    turbine.TypeDesignation = GetCellValue(worksheet, row, columnIndices.GetValueOrDefault("TypeDesignation", -1));
                    turbine.LocalAuthority = GetCellValue(worksheet, row, columnIndices.GetValueOrDefault("LocalAuthority", -1));
                    turbine.LocationType = GetCellValue(worksheet, row, columnIndices.GetValueOrDefault("LocationType", -1));
                    turbine.CoordinateX = ParseDecimal(GetCellValue(worksheet, row, columnIndices.GetValueOrDefault("EastCoordinate", -1)));
                    turbine.CoordinateY = ParseDecimal(GetCellValue(worksheet, row, columnIndices.GetValueOrDefault("NorthCoordinate", -1)));

                    if (existingTurbine == null)
                    {
                        _context.WindTurbines.Add(turbine);
                        result.ImportedCount++;
                    }
                    else
                    {
                        result.UpdatedCount++;
                    }

                    result.TotalCount++;

                    // Save in batches of 1000 to avoid memory issues
                    if (result.TotalCount % 1000 == 0)
                    {
                        await _context.SaveChangesAsync();
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Error importing row {Row}", row);
                    result.Errors.Add($"Row {row}: {ex.Message}");
                }
            }

            // Save any remaining records
            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error importing Excel file");
            result.Errors.Add($"Import failed: {ex.Message}");
        }

        return result;
    }

    private int FindHeaderRow(ExcelWorksheet worksheet)
    {
        // Look for the row containing "Møllenummer (GSRN)"
        for (int row = 1; row <= Math.Min(20, worksheet.Dimension.Rows); row++)
        {
            for (int col = 1; col <= worksheet.Dimension.Columns; col++)
            {
                var cellValue = worksheet.Cells[row, col].Text;
                if (cellValue.Contains("Møllenummer (GSRN)", StringComparison.OrdinalIgnoreCase))
                {
                    return row;
                }
            }
        }
        return -1;
    }

    private Dictionary<string, int> MapColumns(Dictionary<int, string> headers)
    {
        var result = new Dictionary<string, int>();

        foreach (var kvp in headers)
        {
            foreach (var mapping in ColumnMapping)
            {
                if (kvp.Value.Trim().Equals(mapping.Key, StringComparison.OrdinalIgnoreCase))
                {
                    result[mapping.Value] = kvp.Key;
                    break;
                }
            }
        }

        return result;
    }

    private string? GetCellValue(ExcelWorksheet worksheet, int row, int col)
    {
        if (col <= 0 || col > worksheet.Dimension.Columns)
            return null;

        return worksheet.Cells[row, col].Text?.Trim();
    }

    private DateTime? ParseDate(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
            return null;

        if (DateTime.TryParse(value, out var date))
            return DateTime.SpecifyKind(date, DateTimeKind.Utc);

        return null;
    }

    private int? ParseInt(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
            return null;

        // Remove any non-numeric characters except minus sign
        var cleaned = new string(value.Where(c => char.IsDigit(c) || c == '-').ToArray());
        
        if (int.TryParse(cleaned, out var result))
            return result;

        return null;
    }

    private decimal? ParseDecimal(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
            return null;

        // Replace comma with period for decimal parsing
        var cleaned = value.Replace(',', '.');
        
        if (decimal.TryParse(cleaned, System.Globalization.NumberStyles.Any, 
            System.Globalization.CultureInfo.InvariantCulture, out var result))
            return result;

        return null;
    }

    private bool IsNumeric(string value)
    {
        return !string.IsNullOrWhiteSpace(value) && value.All(char.IsDigit);
    }
}
