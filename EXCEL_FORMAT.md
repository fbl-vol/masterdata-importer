# Example Excel Import File Format

The Master Data Importer expects an Excel (.xlsx) file with the following structure:

## Headers (Danish - as expected by the importer)

The following columns should be present (row 7 in the original file format):

| Column | Danish Header | Description |
|--------|---------------|-------------|
| A | Møllenummer (GSRN) | Turbine identifier (required, numeric) |
| B | Dato for oprindelig nettilslutning | Original grid connection date (YYYY-MM-DD) |
| C | Dato for afmeldning | Decommissioning date (YYYY-MM-DD) |
| D | Kapacitet (kW) | Capacity in kilowatts (numeric) |
| E | Rotor-diameter (m) | Rotor diameter in meters (decimal) |
| F | Navhøjde (m) | Hub height in meters (decimal) |
| G | Fabrikat | Manufacturer name |
| H | Typebetegnelse | Type designation/model |
| I | Kommune | Local authority/municipality |
| J | Type af placering | Location type (e.g., LAND, SEA) |

## Example Data Rows

```
Møllenummer (GSRN) | Dato for oprindelig nettilslutning | Dato for afmeldning | Kapacitet (kW) | Rotor-diameter (m) | Navhøjde (m) | Fabrikat | Typebetegnelse | Kommune | Type af placering
570715000000032516 | 1977-12-15 00:00:00 | 2002-11-30 00:00:00 | 22 | 0.1 | 0.1 | Ukendt | Ukendt | 573 - Varde | LAND
570714700000011283 | 1977-12-22 00:00:00 | 2002-11-01 00:00:00 | 30 | 0.1 | 0.1 | Riisager | Ukendt | 400 - Bornholm | LAND
570714700000006517 | 1978-01-01 00:00:00 | 2002-09-02 00:00:00 | 45 | 15.2 | 18 | BONUS | M 102 | 376 - Guldborgsund | LAND
```

## Notes

1. **GSRN is required**: Each row must have a valid GSRN number (numeric)
2. **Date format**: Dates should be in a format parseable by .NET DateTime (e.g., YYYY-MM-DD)
3. **Duplicates**: If the file contains duplicate GSRN numbers, only the first occurrence is imported
4. **Empty values**: Optional fields can be left empty
5. **Header row**: The importer automatically detects the header row by looking for "Møllenummer (GSRN)"
6. **Encoding**: File should be saved as Excel 2007+ format (.xlsx)

## Import Behavior

- New turbines (GSRN not in database) are **inserted**
- Existing turbines (GSRN already in database) are **updated**
- Invalid rows are skipped and reported in the import result
- Import is processed in batches of 1000 records for efficiency
