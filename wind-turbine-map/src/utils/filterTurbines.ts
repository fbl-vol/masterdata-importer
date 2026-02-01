import { WindTurbine, TurbineFilters } from '../types/turbine';

/**
 * Filter turbines based on the selected criteria
 */
export function filterTurbines(
  turbines: WindTurbine[], 
  filters: TurbineFilters
): WindTurbine[] {
  return turbines.filter(turbine => {
    // Filter by manufacturers
    if (filters.manufacturers.length > 0) {
      if (!turbine.manufacturer || !filters.manufacturers.includes(turbine.manufacturer)) {
        return false;
      }
    }

    // Filter by local authorities
    if (filters.localAuthorities.length > 0) {
      if (!turbine.localAuthority || !filters.localAuthorities.includes(turbine.localAuthority)) {
        return false;
      }
    }

    // Filter by location types
    if (filters.locationTypes.length > 0) {
      if (!turbine.locationType || !filters.locationTypes.includes(turbine.locationType)) {
        return false;
      }
    }

    // Filter by type designations
    if (filters.typeDesignations.length > 0) {
      if (!turbine.typeDesignation || !filters.typeDesignations.includes(turbine.typeDesignation)) {
        return false;
      }
    }

    // Filter by capacity range (in MW, but stored as kW)
    if (turbine.capacityKw !== null) {
      const capacityMw = turbine.capacityKw / 1000;
      if (capacityMw < filters.capacityRange.min || capacityMw > filters.capacityRange.max) {
        return false;
      }
    }

    // Filter by year range (based on connection date)
    if (turbine.originalConnectionDate) {
      const year = new Date(turbine.originalConnectionDate).getFullYear();
      const currentYear = new Date().getFullYear();
      
      // Handle "older than 10 years" case
      if (filters.yearRange.max === currentYear - 10 && year < filters.yearRange.max) {
        return true;
      }
      
      if (year < filters.yearRange.min || year > filters.yearRange.max) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Get unique values for a specific field from turbines
 */
export function getUniqueValues(
  turbines: WindTurbine[], 
  field: keyof WindTurbine
): string[] {
  const values = turbines
    .map(t => t[field])
    .filter(v => v !== null && v !== undefined && v !== '') as string[];
  
  return Array.from(new Set(values)).sort();
}

/**
 * Calculate statistics for filtered turbines
 */
export function calculateStats(turbines: WindTurbine[]) {
  const validCapacities = turbines
    .map(t => t.capacityKw)
    .filter(c => c !== null) as number[];

  const totalCapacityKw = validCapacities.reduce((sum, c) => sum + c, 0);
  
  return {
    totalTurbines: turbines.length,
    totalCapacityMw: totalCapacityKw / 1000,
    averageCapacityKw: validCapacities.length > 0 
      ? totalCapacityKw / validCapacities.length 
      : 0,
    manufacturers: getUniqueValues(turbines, 'manufacturer').length,
    modelTypes: getUniqueValues(turbines, 'typeDesignation').length,
  };
}

/**
 * Group turbines by capacity ranges
 */
export function groupByCapacity(turbines: WindTurbine[]): Record<string, number> {
  const ranges: Record<string, number> = {
    '<1MW': 0,
    '1-2MW': 0,
    '2-3MW': 0,
    '3-4MW': 0,
    '4-5MW': 0,
    '5-6MW': 0,
    '6+MW': 0,
  };

  turbines.forEach(turbine => {
    if (turbine.capacityKw === null) return;
    
    const capacityMw = turbine.capacityKw / 1000;
    
    if (capacityMw < 1) ranges['<1MW']++;
    else if (capacityMw < 2) ranges['1-2MW']++;
    else if (capacityMw < 3) ranges['2-3MW']++;
    else if (capacityMw < 4) ranges['3-4MW']++;
    else if (capacityMw < 5) ranges['4-5MW']++;
    else if (capacityMw < 6) ranges['5-6MW']++;
    else ranges['6+MW']++;
  });

  return ranges;
}

/**
 * Group turbines by installation year
 */
export function groupByYear(turbines: WindTurbine[]): Record<string, number> {
  const yearCounts: Record<string, number> = {};
  
  turbines.forEach(turbine => {
    if (!turbine.originalConnectionDate) return;
    
    const year = new Date(turbine.originalConnectionDate).getFullYear();
    yearCounts[year] = (yearCounts[year] || 0) + 1;
  });

  return yearCounts;
}
