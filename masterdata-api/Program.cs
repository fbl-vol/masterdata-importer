using masterdata_api.Data;
using Microsoft.EntityFrameworkCore;
using masterdata_api.Services;
using Scalar.AspNetCore;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();

// Configure PostgreSQL Database
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? "Host=postgres;Port=5432;Database=masterdata;Username=postgres;Password=postgres";
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString));

// Register services
builder.Services.AddScoped<ExcelImportService>();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Ensure database is created and migrated
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    try
    {
        await dbContext.Database.MigrateAsync();
    }
    catch (Exception ex)
    {
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while migrating the database.");
    }
}

// Configure the HTTP request pipeline.
// Enable OpenAPI and Scalar in all environments (including Production for Docker access)
// Scalar UI will be available at:
//   - Local development: https://localhost:5001/scalar/v1 or http://localhost:5000/scalar/v1
//   - Docker: http://localhost:8080/scalar/v1
// OpenAPI spec will be available at:
//   - Local development: https://localhost:5001/openapi/v1.json or http://localhost:5000/openapi/v1.json
//   - Docker: http://localhost:8080/openapi/v1.json
app.MapOpenApi();
app.MapScalarApiReference(options =>
{
    options.WithTitle("MasterData Importer API");
    options.WithTheme(ScalarTheme.Purple);
    options.WithDefaultHttpClient(ScalarTarget.CSharp, ScalarClient.HttpClient);
});

app.UseCors("AllowAll");
app.UseAuthorization();
app.MapControllers();

app.Run();
