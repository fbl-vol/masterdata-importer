# Master Data Importer

A .NET 10.0 Web API for importing and managing wind turbine master data from Excel files. The data comes in Danish and is stored with translated field names in a PostgreSQL database.

## Features

- Import wind turbine data from Excel (.xlsx) files
- Automatic database creation and migration on startup
- RESTful API endpoints for data retrieval
- Docker and Docker Compose support
- Swagger UI for API documentation
- PostgreSQL database storage
- Translation of Danish field names to English

## Prerequisites

- Docker and Docker Compose
- OR .NET 10.0 SDK (for local development)

## Quick Start with Docker

1. Clone the repository
2. Run the application with Docker Compose:

```bash
docker-compose up --build
```

3. Access the API:
   - Swagger UI: http://localhost:8080
   - API Base URL: http://localhost:8080/api

## API Endpoints

### Import Data
- **POST** `/api/windturbines/import`
  - Upload an Excel file to import wind turbine data
  - Content-Type: `multipart/form-data`
  - Form field: `file` (Excel file)

### Retrieve Data
- **GET** `/api/windturbines` - Get all wind turbines (paginated)
  - Query params: `page` (default: 1), `pageSize` (default: 100)

- **GET** `/api/windturbines/gsrn/{gsrn}` - Get a single turbine by GSRN number
  - Example: `/api/windturbines/gsrn/570715000000032516`

- **POST** `/api/windturbines/gsrn/batch` - Get multiple turbines by GSRN list
  - Body: JSON array of GSRN numbers
  - Example: `["570715000000032516", "570714700000011283"]`

- **GET** `/api/windturbines/model/{modelType}` - Get turbines by model type
  - Query params: `page`, `pageSize`
  - Example: `/api/windturbines/model/M 102`

- **GET** `/api/windturbines/manufacturer/{manufacturer}` - Get turbines by manufacturer
  - Query params: `page`, `pageSize`
  - Example: `/api/windturbines/manufacturer/BONUS`

- **GET** `/api/windturbines/stats` - Get database statistics

## Data Model

Wind turbine data includes:
- GSRN (unique identifier)
- Original connection date
- Decommissioning date
- Capacity (kW)
- Rotor diameter (m)
- Hub height (m)
- Manufacturer
- Type designation
- Local authority
- Location type
- Coordinates (X, Y)

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

## Local Development

### Running without Docker

1. Install PostgreSQL and create a database named `masterdata`
2. Update connection string in `appsettings.json` if needed
3. Run the application:

```bash
cd MasterDataImporter
dotnet run
```

### Database Migrations

The application automatically runs migrations on startup. To create new migrations:

```bash
cd MasterDataImporter
dotnet ef migrations add MigrationName --output-dir Data/Migrations
```

## Technology Stack

- .NET 10.0
- ASP.NET Core Web API
- Entity Framework Core 10.0
- PostgreSQL 17
- EPPlus (Excel file processing)
- Swagger/OpenAPI
- Docker & Docker Compose

## License

See LICENSE file for details.

