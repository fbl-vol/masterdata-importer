import { useMemo, useState } from 'react';
import { TurbineMap } from './components/Map/TurbineMap';
import { FilterPanel } from './components/Filters/FilterPanel';
import { StatsPanel } from './components/Statistics/StatsPanel';
import useTurbines from './hooks/useTurbines';
import { useFilters } from './hooks/useFilters';
import { filterTurbines } from './utils/filterTurbines';
import './App.css';

function App() {
  const { turbines, loading, error } = useTurbines();
  const {
    filters,
    setManufacturers,
    setLocalAuthorities,
    setLocationTypes,
    setTypeDesignations,
    setSiteNames,
    setGsrns,
    setCapacityRange,
    setYearRange,
    resetFilters,
  } = useFilters();

  const [showFilters, setShowFilters] = useState(true);
  const [showStats, setShowStats] = useState(true);
  const [colorBy, setColorBy] = useState<'manufacturer' | 'age' | 'capacity'>('manufacturer');

  // Filter turbines based on selected criteria
  const filteredTurbines = useMemo(
    () => filterTurbines(turbines, filters),
    [turbines, filters]
  );

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
        <p>Loading wind turbine data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-error">
        <h2>Error Loading Data</h2>
        <p>{error}</p>
        <p className="error-hint">
          Make sure the API is running at {import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}
        </p>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <h1>🌬️ Wind Turbine Map</h1>
          <p>Interactive visualization of wind turbines in Denmark</p>
        </div>
        <div className="header-controls">
          <div className="color-selector">
            <label>Color by:</label>
            <select 
              value={colorBy} 
              onChange={(e) => setColorBy(e.target.value as 'manufacturer' | 'age' | 'capacity')}
            >
              <option value="manufacturer">Manufacturer</option>
              <option value="age">Age</option>
              <option value="capacity">Capacity</option>
            </select>
          </div>
          <button
            className={`toggle-button ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? '← Hide' : 'Show →'} Filters
          </button>
          <button
            className={`toggle-button ${showStats ? 'active' : ''}`}
            onClick={() => setShowStats(!showStats)}
          >
            {showStats ? 'Hide ↓' : 'Show ↑'} Stats
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="app-content">
        {/* Sidebar - Filters */}
        {showFilters && (
          <aside className="app-sidebar">
            <FilterPanel
              turbines={turbines}
              selectedManufacturers={filters.manufacturers}
              selectedAuthorities={filters.localAuthorities}
              selectedLocationTypes={filters.locationTypes}
              selectedTypeDesignations={filters.typeDesignations}
              selectedSiteNames={filters.siteNames}
              selectedGsrns={filters.gsrns}
              capacityRange={filters.capacityRange}
              yearRange={filters.yearRange}
              onManufacturersChange={setManufacturers}
              onAuthoritiesChange={setLocalAuthorities}
              onLocationTypesChange={setLocationTypes}
              onTypeDesignationsChange={setTypeDesignations}
              onSiteNamesChange={setSiteNames}
              onGsrnsChange={setGsrns}
              onCapacityRangeChange={setCapacityRange}
              onYearRangeChange={setYearRange}
              onResetFilters={resetFilters}
            />
          </aside>
        )}

        {/* Main Map Area */}
        <main className="app-main">
          <div className="turbine-count">
            Showing <strong>{filteredTurbines.length}</strong> of <strong>{turbines.length}</strong> turbines
          </div>
          <TurbineMap turbines={filteredTurbines} colorBy={colorBy} />
        </main>
      </div>

      {/* Statistics Panel */}
      {showStats && (
        <div className="app-stats">
          <StatsPanel turbines={turbines} filteredTurbines={filteredTurbines} />
        </div>
      )}
    </div>
  );
}

export default App;
