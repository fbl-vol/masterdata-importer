import { useState } from 'react';
import type { WindTurbine } from '../../types/turbine';
import { getUniqueValues } from '../../utils/filterTurbines';
import './FilterPanel.css';

interface FilterPanelProps {
  turbines: WindTurbine[];
  selectedManufacturers: string[];
  selectedAuthorities: string[];
  selectedLocationTypes: string[];
  selectedTypeDesignations: string[];
  selectedSiteNames: string[];
  selectedGsrns: string[];
  capacityRange: { min: number; max: number };
  yearRange: { min: number; max: number };
  onManufacturersChange: (selected: string[]) => void;
  onAuthoritiesChange: (selected: string[]) => void;
  onLocationTypesChange: (selected: string[]) => void;
  onTypeDesignationsChange: (selected: string[]) => void;
  onSiteNamesChange: (selected: string[]) => void;
  onGsrnsChange: (selected: string[]) => void;
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
  selectedSiteNames,
  selectedGsrns,
  capacityRange,
  yearRange,
  onManufacturersChange,
  onAuthoritiesChange,
  onLocationTypesChange,
  onTypeDesignationsChange,
  onSiteNamesChange,
  onGsrnsChange,
  onCapacityRangeChange,
  onYearRangeChange,
  onResetFilters,
}: FilterPanelProps) {
  // Search states for each filterable section
  const [manufacturerSearch, setManufacturerSearch] = useState('');
  const [authoritySearch, setAuthoritySearch] = useState('');
  const [typeDesignationSearch, setTypeDesignationSearch] = useState('');
  const [siteNameSearch, setSiteNameSearch] = useState('');
  const [gsrnSearch, setGsrnSearch] = useState('');

  const manufacturers = getUniqueValues(turbines, 'manufacturer');
  const authorities = getUniqueValues(turbines, 'localAuthority');
  const locationTypes = getUniqueValues(turbines, 'locationType');
  const typeDesignations = getUniqueValues(turbines, 'typeDesignation');
  const siteNames = getUniqueValues(turbines, 'siteName');
  const gsrns = getUniqueValues(turbines, 'gsrn');

  // Filter options based on search queries
  const filteredManufacturers = manufacturers.filter(m => 
    m.toLowerCase().includes(manufacturerSearch.toLowerCase())
  );
  const filteredAuthorities = authorities.filter(a => 
    a.toLowerCase().includes(authoritySearch.toLowerCase())
  );
  const filteredTypeDesignations = typeDesignations.filter(t => 
    t.toLowerCase().includes(typeDesignationSearch.toLowerCase())
  );
  const filteredSiteNames = siteNames.filter(s =>
    s.toLowerCase().includes(siteNameSearch.toLowerCase())
  );
  const filteredGsrns = gsrns.filter(g =>
    g.toLowerCase().includes(gsrnSearch.toLowerCase())
  );

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
    selectedSiteNames.length > 0 ||
    selectedGsrns.length > 0 ||
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
        <input
          type="text"
          placeholder="Search manufacturers..."
          value={manufacturerSearch}
          onChange={(e) => setManufacturerSearch(e.target.value)}
          className="filter-search-input"
        />
        <div className="filter-options">
          {filteredManufacturers.slice(0, 10).map(manufacturer => (
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
          {filteredManufacturers.length > 10 && (
            <details className="filter-more">
              <summary>Show {filteredManufacturers.length - 10} more...</summary>
              {filteredManufacturers.slice(10).map(manufacturer => (
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
        <input
          type="text"
          placeholder="Search authorities..."
          value={authoritySearch}
          onChange={(e) => setAuthoritySearch(e.target.value)}
          className="filter-search-input"
        />
        <div className="filter-options">
          {filteredAuthorities.slice(0, 10).map(authority => (
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
          {filteredAuthorities.length > 10 && (
            <details className="filter-more">
              <summary>Show {filteredAuthorities.length - 10} more...</summary>
              {filteredAuthorities.slice(10).map(authority => (
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
        <input
          type="text"
          placeholder="Search type designations..."
          value={typeDesignationSearch}
          onChange={(e) => setTypeDesignationSearch(e.target.value)}
          className="filter-search-input"
        />
        <div className="filter-options">
          {filteredTypeDesignations.slice(0, 10).map(designation => (
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
          {filteredTypeDesignations.length > 10 && (
            <details className="filter-more">
              <summary>Show {filteredTypeDesignations.length - 10} more...</summary>
              {filteredTypeDesignations.slice(10).map(designation => (
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

      {/* Site Name Filter */}
      <div className="filter-section">
        <h3>Site Name</h3>
        <input
          type="text"
          placeholder="Search site names..."
          value={siteNameSearch}
          onChange={(e) => setSiteNameSearch(e.target.value)}
          className="filter-search-input"
        />
        <div className="filter-options">
          {filteredSiteNames.slice(0, 10).map(siteName => (
            <label key={siteName} className="filter-checkbox">
              <input
                type="checkbox"
                checked={selectedSiteNames.includes(siteName)}
                onChange={() => handleCheckboxChange(
                  siteName,
                  selectedSiteNames,
                  onSiteNamesChange
                )}
              />
              <span>{siteName}</span>
            </label>
          ))}
          {filteredSiteNames.length > 10 && (
            <details className="filter-more">
              <summary>Show {filteredSiteNames.length - 10} more...</summary>
              {filteredSiteNames.slice(10).map(siteName => (
                <label key={siteName} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedSiteNames.includes(siteName)}
                    onChange={() => handleCheckboxChange(
                      siteName,
                      selectedSiteNames,
                      onSiteNamesChange
                    )}
                  />
                  <span>{siteName}</span>
                </label>
              ))}
            </details>
          )}
        </div>
      </div>

      {/* GSRN Filter */}
      <div className="filter-section">
        <h3>GSRN</h3>
        <input
          type="text"
          placeholder="Search GSRNs..."
          value={gsrnSearch}
          onChange={(e) => setGsrnSearch(e.target.value)}
          className="filter-search-input"
        />
        <div className="filter-options">
          {filteredGsrns.slice(0, 10).map(gsrn => (
            <label key={gsrn} className="filter-checkbox">
              <input
                type="checkbox"
                checked={selectedGsrns.includes(gsrn)}
                onChange={() => handleCheckboxChange(
                  gsrn,
                  selectedGsrns,
                  onGsrnsChange
                )}
              />
              <span>{gsrn}</span>
            </label>
          ))}
          {filteredGsrns.length > 10 && (
            <details className="filter-more">
              <summary>Show {filteredGsrns.length - 10} more...</summary>
              {filteredGsrns.slice(10).map(gsrn => (
                <label key={gsrn} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedGsrns.includes(gsrn)}
                    onChange={() => handleCheckboxChange(
                      gsrn,
                      selectedGsrns,
                      onGsrnsChange
                    )}
                  />
                  <span>{gsrn}</span>
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
