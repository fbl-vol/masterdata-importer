import { WindTurbine } from '../../types/turbine';
import { getUniqueValues } from '../../utils/filterTurbines';
import './FilterPanel.css';

interface FilterPanelProps {
  turbines: WindTurbine[];
  selectedManufacturers: string[];
  selectedAuthorities: string[];
  selectedLocationTypes: string[];
  selectedTypeDesignations: string[];
  capacityRange: { min: number; max: number };
  yearRange: { min: number; max: number };
  onManufacturersChange: (selected: string[]) => void;
  onAuthoritiesChange: (selected: string[]) => void;
  onLocationTypesChange: (selected: string[]) => void;
  onTypeDesignationsChange: (selected: string[]) => void;
  onCapacityRangeChange: (min: number, max: number) => void;
  onYearRangeChange: (min: number, max: number) => void;
  onResetFilters: () => void;
}

export function FilterPanel({
  turbines,
  selectedManufacturers,
  selectedAuthorities,
  selectedLocationTypes,
  selectedTypeDesignations,
  capacityRange,
  yearRange,
  onManufacturersChange,
  onAuthoritiesChange,
  onLocationTypesChange,
  onTypeDesignationsChange,
  onCapacityRangeChange,
  onYearRangeChange,
  onResetFilters,
}: FilterPanelProps) {
  const manufacturers = getUniqueValues(turbines, 'manufacturer');
  const authorities = getUniqueValues(turbines, 'localAuthority');
  const locationTypes = getUniqueValues(turbines, 'locationType');
  const typeDesignations = getUniqueValues(turbines, 'typeDesignation');

  const currentYear = new Date().getFullYear();

  const handleCheckboxChange = (
    value: string,
    selected: string[],
    onChange: (selected: string[]) => void
  ) => {
    if (selected.includes(value)) {
      onChange(selected.filter(v => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const hasActiveFilters = 
    selectedManufacturers.length > 0 ||
    selectedAuthorities.length > 0 ||
    selectedLocationTypes.length > 0 ||
    selectedTypeDesignations.length > 0 ||
    capacityRange.min !== 0 ||
    capacityRange.max !== 10 ||
    yearRange.min !== currentYear - 10 ||
    yearRange.max !== currentYear;

  return (
    <div className="filter-panel">
      <div className="filter-panel-header">
        <h2>Filters</h2>
        {hasActiveFilters && (
          <button className="reset-button" onClick={onResetFilters}>
            Reset All
          </button>
        )}
      </div>

      {/* Manufacturer Filter */}
      <div className="filter-section">
        <h3>Manufacturer</h3>
        <div className="filter-options">
          {manufacturers.slice(0, 10).map(manufacturer => (
            <label key={manufacturer} className="filter-checkbox">
              <input
                type="checkbox"
                checked={selectedManufacturers.includes(manufacturer)}
                onChange={() => handleCheckboxChange(
                  manufacturer,
                  selectedManufacturers,
                  onManufacturersChange
                )}
              />
              <span>{manufacturer}</span>
            </label>
          ))}
          {manufacturers.length > 10 && (
            <details className="filter-more">
              <summary>Show {manufacturers.length - 10} more...</summary>
              {manufacturers.slice(10).map(manufacturer => (
                <label key={manufacturer} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedManufacturers.includes(manufacturer)}
                    onChange={() => handleCheckboxChange(
                      manufacturer,
                      selectedManufacturers,
                      onManufacturersChange
                    )}
                  />
                  <span>{manufacturer}</span>
                </label>
              ))}
            </details>
          )}
        </div>
      </div>

      {/* Local Authority Filter */}
      <div className="filter-section">
        <h3>Local Authority</h3>
        <div className="filter-options">
          {authorities.slice(0, 10).map(authority => (
            <label key={authority} className="filter-checkbox">
              <input
                type="checkbox"
                checked={selectedAuthorities.includes(authority)}
                onChange={() => handleCheckboxChange(
                  authority,
                  selectedAuthorities,
                  onAuthoritiesChange
                )}
              />
              <span>{authority}</span>
            </label>
          ))}
          {authorities.length > 10 && (
            <details className="filter-more">
              <summary>Show {authorities.length - 10} more...</summary>
              {authorities.slice(10).map(authority => (
                <label key={authority} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedAuthorities.includes(authority)}
                    onChange={() => handleCheckboxChange(
                      authority,
                      selectedAuthorities,
                      onAuthoritiesChange
                    )}
                  />
                  <span>{authority}</span>
                </label>
              ))}
            </details>
          )}
        </div>
      </div>

      {/* Location Type Filter */}
      <div className="filter-section">
        <h3>Location Type</h3>
        <div className="filter-options">
          {locationTypes.map(type => (
            <label key={type} className="filter-checkbox">
              <input
                type="checkbox"
                checked={selectedLocationTypes.includes(type)}
                onChange={() => handleCheckboxChange(
                  type,
                  selectedLocationTypes,
                  onLocationTypesChange
                )}
              />
              <span>{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Type Designation Filter */}
      <div className="filter-section">
        <h3>Type Designation</h3>
        <div className="filter-options">
          {typeDesignations.slice(0, 10).map(designation => (
            <label key={designation} className="filter-checkbox">
              <input
                type="checkbox"
                checked={selectedTypeDesignations.includes(designation)}
                onChange={() => handleCheckboxChange(
                  designation,
                  selectedTypeDesignations,
                  onTypeDesignationsChange
                )}
              />
              <span>{designation}</span>
            </label>
          ))}
          {typeDesignations.length > 10 && (
            <details className="filter-more">
              <summary>Show {typeDesignations.length - 10} more...</summary>
              {typeDesignations.slice(10).map(designation => (
                <label key={designation} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedTypeDesignations.includes(designation)}
                    onChange={() => handleCheckboxChange(
                      designation,
                      selectedTypeDesignations,
                      onTypeDesignationsChange
                    )}
                  />
                  <span>{designation}</span>
                </label>
              ))}
            </details>
          )}
        </div>
      </div>

      {/* Capacity Range Filter */}
      <div className="filter-section">
        <h3>Capacity Range (MW)</h3>
        <div className="range-inputs">
          <input
            type="number"
            min="0"
            max="10"
            step="0.5"
            value={capacityRange.min}
            onChange={(e) => onCapacityRangeChange(
              parseFloat(e.target.value),
              capacityRange.max
            )}
            className="range-input"
          />
          <span>to</span>
          <input
            type="number"
            min="0"
            max="10"
            step="0.5"
            value={capacityRange.max}
            onChange={(e) => onCapacityRangeChange(
              capacityRange.min,
              parseFloat(e.target.value)
            )}
            className="range-input"
          />
        </div>
      </div>

      {/* Year Range Filter */}
      <div className="filter-section">
        <h3>Installation Year</h3>
        <div className="range-inputs">
          <input
            type="number"
            min="1980"
            max={currentYear}
            value={yearRange.min}
            onChange={(e) => onYearRangeChange(
              parseInt(e.target.value),
              yearRange.max
            )}
            className="range-input"
          />
          <span>to</span>
          <input
            type="number"
            min="1980"
            max={currentYear}
            value={yearRange.max}
            onChange={(e) => onYearRangeChange(
              yearRange.min,
              parseInt(e.target.value)
            )}
            className="range-input"
          />
        </div>
      </div>
    </div>
  );
}
