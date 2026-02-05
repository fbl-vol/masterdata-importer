using System.Text.Json;
using System.Text.Json.Serialization;
using masterdata_api.Data;
using masterdataapi.Models;
using Microsoft.EntityFrameworkCore;

namespace masterdata_api.Services;

public class CadastralLookupService
{
    private readonly HttpClient _httpClient;
    private readonly ApplicationDbContext _context;
    private readonly ILogger<CadastralLookupService> _logger;

    public CadastralLookupService(
        HttpClient httpClient,
        ApplicationDbContext context,
        ILogger<CadastralLookupService> logger)
    {
        _httpClient = httpClient;
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Gets or creates a Site based on cadastral information
    /// Returns the site and the sfeejendomsnr to be stored on the turbine
    /// </summary>
    public async Task<(Site? site, string? sfEjendomsnr)> GetOrCreateSiteFromCadastralDataAsync(string? cadastralNo, string? cadastralDistrict)
    {
        if (string.IsNullOrWhiteSpace(cadastralNo) || string.IsNullOrWhiteSpace(cadastralDistrict))
        {
            _logger.LogDebug("Cadastral information is missing, skipping site lookup");
            return (null, null);
        }

        try
        {
            // Step 1: Get sfeejendomsnr from DAWA API
            var sfEjendomsNr = await GetSfEjendomsNrAsync(cadastralNo, cadastralDistrict);
            if (string.IsNullOrWhiteSpace(sfEjendomsNr))
            {
                _logger.LogWarning("Could not retrieve sfeejendomsnr for cadastral {CadastralNo}, {CadastralDistrict}", 
                    cadastralNo, cadastralDistrict);
                return (null, null);
            }

            // Step 2: Get owner name from OIS API
            var ownerName = await GetOwnerNameAsync(sfEjendomsNr);
            if (string.IsNullOrWhiteSpace(ownerName))
            {
                _logger.LogWarning("Could not retrieve owner name for sfeejendomsnr {SfEjendomsNr}", sfEjendomsNr);
                ownerName = $"Unknown Owner (BFE: {sfEjendomsNr})";
            }

            // Step 3: Check if we already have a site with this owner name
            var existingSite = await _context.Sites
                .FirstOrDefaultAsync(s => s.Name == ownerName);

            if (existingSite != null)
            {
                _logger.LogDebug("Found existing site for owner: {OwnerName}", ownerName);
                return (existingSite, sfEjendomsNr);
            }

            // Step 4: Create new site for this owner
            var newSite = new Site
            {
                Name = ownerName,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Sites.Add(newSite);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Created new site: {SiteName}", ownerName);

            return (newSite, sfEjendomsNr);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during cadastral lookup for {CadastralNo}, {CadastralDistrict}", 
                cadastralNo, cadastralDistrict);
            return (null, null);
        }
    }

    /// <summary>
    /// Queries DAWA API to get sfeejendomsnr from cadastral information
    /// </summary>
    private async Task<string?> GetSfEjendomsNrAsync(string cadastralNo, string cadastralDistrict)
    {
        try
        {
            var query = $"{cadastralNo}, {cadastralDistrict}";
            var url = $"https://dawa.aws.dk/jordstykker/autocomplete?per_side=10&q={Uri.EscapeDataString(query)}";

            _logger.LogDebug("Querying DAWA API: {Url}", url);

            var response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            var results = JsonSerializer.Deserialize<List<DawaAutocompleteResult>>(json);

            if (results == null || results.Count == 0)
            {
                _logger.LogWarning("No results from DAWA API for query: {Query}", query);
                return null;
            }

            var sfEjendomsNr = results[0].Jordstykke?.SfEjendomsNr;
            _logger.LogDebug("Found sfeejendomsnr: {SfEjendomsNr} for query: {Query}", sfEjendomsNr, query);
            await Task.Delay(TimeSpan.FromSeconds(1)); // To avoid rate limiting
            return sfEjendomsNr;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error querying DAWA API for {CadastralNo}, {CadastralDistrict}", 
                cadastralNo, cadastralDistrict);
            return null;
        }
    }

    /// <summary>
    /// Queries OIS API to get owner name from sfeejendomsnr
    /// </summary>
    private async Task<string?> GetOwnerNameAsync(string sfEjendomsNr)
    {
        try
        {
            var url = $"https://ois.dk/api/ejer/get?bfe={sfEjendomsNr}";

            _logger.LogDebug("Querying OIS API: {Url}", url);

            var response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            var result = JsonSerializer.Deserialize<OisOwnerResult>(json);

            if (result?.EjerData == null || result.EjerData.Count == 0)
            {
                _logger.LogWarning("No owner data from OIS API for sfeejendomsnr: {SfEjendomsNr}", sfEjendomsNr);
                return null;
            }

            var ownerName = result.EjerData[0].Name;
            _logger.LogDebug("Found owner name: {OwnerName} for sfeejendomsnr: {SfEjendomsNr}", 
                ownerName, sfEjendomsNr);

            return ownerName;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error querying OIS API for sfeejendomsnr: {SfEjendomsNr}", sfEjendomsNr);
            return null;
        }
    }
}

// DTOs for DAWA API response
public class DawaAutocompleteResult
{
    [JsonPropertyName("tekst")]
    public string? Tekst { get; set; }

    [JsonPropertyName("jordstykke")]
    public DawaJordstykke? Jordstykke { get; set; }
}

public class DawaJordstykke
{
    [JsonPropertyName("sfeejendomsnr")]
    public string? SfEjendomsNr { get; set; }
}

// DTOs for OIS API response
public class OisOwnerResult
{
    [JsonPropertyName("bfe")]
    public long? Bfe { get; set; }

    [JsonPropertyName("ejerdata")]
    public List<OisEjerData>? EjerData { get; set; }
}

public class OisEjerData
{
    [JsonPropertyName("name")]
    public string? Name { get; set; }
}
