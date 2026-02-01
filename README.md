# Master Data Importer

A .NET 10.0 Web API for importing and managing wind turbine master data from Excel files. The data comes in Danish and is stored with translated field names in a PostgreSQL database.

## Features

- ✅ Import wind turbine data from Excel (.xlsx) files
- ✅ Automatic database creation and migration on startup
- ✅ RESTful API endpoints for data retrieval
- ✅ Docker and Docker Compose support for easy deployment
- ✅ Interactive API documentation with Scalar UI
- ✅ PostgreSQL database storage
- ✅ Translation of Danish field names to English
- ✅ Duplicate detection and handling
- ✅ Batch operations support

## Prerequisites

- Docker and Docker Compose (recommended)
- OR .NET 10.0 SDK (for local development)

## Quick Start with Docker

1. Clone the repository:
```bash
git clone <repository-url>
cd masterdata-importer
```

2. Start the application with Docker Compose:
```bash
docker compose up --build
```

3. Access the services:
   - **API Interactive Documentation**: http://localhost:8080/scalar/v1
   - **OpenAPI JSON**: http://localhost:8080/openapi/v1.json
   - **API Base URL**: http://localhost:8080/api

4. Test the API (using the provided test script):
```bash
./test-api.sh
```

## API Endpoints

### Import Data
- **POST** `/api/windturbines/import`
  - Upload an Excel file to import wind turbine data
  - Content-Type: `multipart/form-data`
  - Form field: `file` (Excel file with .xlsx extension)
  - Returns: `ImportResultDto` with counts and any errors

### Retrieve Data
- **GET** `/api/windturbines` - Get all wind turbines (paginated)
  - Query params: 
    - `page` (default: 1)
    - `pageSize` (default: 100)
  - Returns: Array of `WindTurbineDto`

- **GET** `/api/windturbines/gsrn/{gsrn}` - Get a single turbine by GSRN number
  - Path param: `gsrn` (GSRN identifier)
  - Example: `/api/windturbines/gsrn/570715000000032516`
  - Returns: `WindTurbineDto` or 404 if not found

- **POST** `/api/windturbines/gsrn/batch` - Get multiple turbines by GSRN list
  - Body: JSON array of GSRN numbers
  - Example: `["570715000000032516", "570714700000011283"]`
  - Returns: Array of `WindTurbineDto`

- **GET** `/api/windturbines/model/{modelType}` - Get turbines by model type
  - Path param: `modelType` (type designation, URL encoded for spaces)
  - Query params: `page`, `pageSize`
  - Example: `/api/windturbines/model/M%20102`
  - Returns: Array of `WindTurbineDto`

- **GET** `/api/windturbines/manufacturer/{manufacturer}` - Get turbines by manufacturer
  - Path param: `manufacturer` (manufacturer name)
  - Query params: `page`, `pageSize`
  - Example: `/api/windturbines/manufacturer/BONUS`
  - Returns: Array of `WindTurbineDto`

- **GET** `/api/windturbines/stats` - Get database statistics
  - Returns: Object with `totalTurbines`, `manufacturers`, `modelTypes` counts

## Example Usage

### Import an Excel file:
```bash
curl -X POST http://localhost:8080/api/windturbines/import \
  -F "file=@/path/to/windturbine-data.xlsx"
```

### Get turbine by GSRN:
```bash
curl http://localhost:8080/api/windturbines/gsrn/570715000000032516
```

### Get turbines by manufacturer:
```bash
curl "http://localhost:8080/api/windturbines/manufacturer/BONUS?pageSize=10"
```

### Get multiple turbines:
```bash
curl -X POST http://localhost:8080/api/windturbines/gsrn/batch \
  -H "Content-Type: application/json" \
  -d '["570715000000032516", "570714700000011283"]'
```

## Data Model

Wind turbine data includes:
- **GSRN** - Unique identifier (Møllenummer in Danish)
- **OriginalConnectionDate** - Date of grid connection (Dato for oprindelig nettilslutning)
- **DecommissioningDate** - Date of decommissioning (Dato for afmeldning)
- **CapacityKw** - Turbine capacity in kW (Kapacitet)
- **RotorDiameterM** - Rotor diameter in meters (Rotor-diameter)
- **HubHeightM** - Hub height in meters (Navhøjde)
- **Manufacturer** - Turbine manufacturer (Fabrikat)
- **TypeDesignation** - Model type (Typebetegnelse)
- **LocalAuthority** - Municipality (Kommune)
- **LocationType** - Type of location (Type af placering)
- **Coordinates** - X, Y coordinates (UTM coordinates)

## Danish to English Field Mapping

| Danish | English |
|--------|---------|
| Møllenummer (GSRN) | Gsrn |
| Dato for oprindelig nettilslutning | OriginalConnectionDate |
| Dato for afmeldning | DecommissioningDate |
| Kapacitet (kW) | CapacityKw |
| Rotor-diameter (m) | RotorDiameterM |
| Navhøjde (m) | HubHeightM |
| Fabrikat | Manufacturer |
| Typebetegnelse | TypeDesignation |
| Kommune | LocalAuthority |
| Type af placering | LocationType |

## Architecture

### Services
- **PostgreSQL 17** - Database for storing wind turbine data
- **MasterDataImporter API** - .NET 10.0 Web API

### Key Features
- Automatic database schema creation via Entity Framework migrations
- Batch import processing (1000 records per batch)
- Duplicate GSRN detection within import files
- UTC datetime handling for PostgreSQL compatibility
- CORS enabled for cross-origin requests

## Local Development

### Running without Docker

1. Install PostgreSQL and create a database named `masterdata`
2. Update connection string in `MasterDataImporter/appsettings.json` if needed
3. Run the application:

```bash
cd MasterDataImporter
dotnet run
```

The API will be available at `http://localhost:5000`

### Database Migrations

The application automatically runs migrations on startup. To create new migrations manually:

```bash
cd MasterDataImporter
dotnet ef migrations add MigrationName --output-dir Data/Migrations
```

## Docker Configuration

The project includes:
- **Dockerfile** - Multi-stage build for optimized image size
- **docker-compose.yml** - Orchestrates PostgreSQL and API services
- **.dockerignore** - Excludes unnecessary files from build

### Docker Commands

```bash
# Build and start services
docker compose up --build

# Start in detached mode
docker compose up -d

# View logs
docker logs masterdata-api
docker logs masterdata-postgres

# Stop services
docker compose down

# Remove volumes (clean database)
docker compose down -v
```

## Technology Stack

- **.NET 10.0** - Application framework
- **ASP.NET Core Web API** - REST API framework
- **Entity Framework Core 10.0** - ORM for database access
- **PostgreSQL 17** - Relational database
- **Npgsql** - PostgreSQL provider for .NET
- **EPPlus 7.5.2** - Excel file processing library
- **Scalar** - Interactive API documentation UI
- **Docker & Docker Compose** - Containerization

## Project Structure

```
masterdata-importer/
├── MasterDataImporter/
│   ├── Controllers/          # API endpoints
│   ├── Data/                 # Database context and migrations
│   ├── DTOs/                 # Data transfer objects
│   ├── Models/               # Entity models
│   ├── Services/             # Business logic services
│   ├── Dockerfile            # Container definition
│   └── Program.cs            # Application entry point
├── docker-compose.yml        # Service orchestration
├── test-api.sh              # API test script
└── README.md                # This file
```

## Troubleshooting

### Container won't start
Check logs: `docker logs masterdata-api`

### Database connection issues
Ensure PostgreSQL is healthy: `docker ps`
Check connection string in `appsettings.json`

### Import fails
- Ensure file is .xlsx format
- Check API logs for specific errors
- Verify the Excel file has the expected Danish column headers

## Security Considerations

⚠️ **Important**: This project uses default credentials for demonstration purposes. Before deploying to production:

1. **Change default passwords**: Update PostgreSQL credentials in:
   - `docker-compose.yml` (POSTGRES_PASSWORD)
   - `MasterDataImporter/appsettings.json` (ConnectionStrings)
   - Use environment variables or secrets management

2. **Restrict CORS**: The current CORS policy allows all origins. Update `Program.cs` to:
   ```csharp
   options.AddPolicy("AllowSpecificOrigin", policy =>
   {
       policy.WithOrigins("https://yourdomain.com")
             .WithMethods("GET", "POST")
             .WithHeaders("Content-Type");
   });
   ```

3. **Use secrets management**: For production, use:
   - Docker secrets
   - Azure Key Vault
   - AWS Secrets Manager
   - Kubernetes secrets
   - Environment variables

4. **Enable HTTPS**: Configure SSL/TLS certificates for production deployment

## License

See LICENSE file for details.

