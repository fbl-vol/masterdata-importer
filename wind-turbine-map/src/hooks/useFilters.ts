import { useState, useCallback } from 'react';
import type { TurbineFilters } from '../types/turbine';

const currentYear = new Date().getFullYear();

const defaultFilters: TurbineFilters = {
  manufacturers: [],
  localAuthorities: [],
  locationTypes: [],
  typeDesignations: [],
  siteNames: [],
  capacityRange: { min: 0, max: 10 }, // 0-10 MW
  yearRange: { min: currentYear - 10, max: currentYear },
};

interface UseFiltersResult {
  filters: TurbineFilters;
  setManufacturers: (manufacturers: string[]) => void;
  setLocalAuthorities: (authorities: string[]) => void;
  setLocationTypes: (types: string[]) => void;
  setTypeDesignations: (designations: string[]) => void;
  setSiteNames: (siteNames: string[]) => void;
  setCapacityRange: (min: number, max: number) => void;
  setYearRange: (min: number, max: number) => void;
  resetFilters: () => void;
  removeFilter: (filterType: string, value?: string) => void;
}

/**
 * Custom hook for managing filter state
 */
export function useFilters(): UseFiltersResult {
  const [filters, setFilters] = useState<TurbineFilters>(defaultFilters);

  const setManufacturers = useCallback((manufacturers: string[]) => {
    setFilters(prev => ({ ...prev, manufacturers }));
  }, []);

  const setLocalAuthorities = useCallback((localAuthorities: string[]) => {
    setFilters(prev => ({ ...prev, localAuthorities }));
  }, []);

  const setLocationTypes = useCallback((locationTypes: string[]) => {
    setFilters(prev => ({ ...prev, locationTypes }));
  }, []);

  const setTypeDesignations = useCallback((typeDesignations: string[]) => {
    setFilters(prev => ({ ...prev, typeDesignations }));
  }, []);

  const setSiteNames = useCallback((siteNames: string[]) => {
    setFilters(prev => ({ ...prev, siteNames }));
  }, []);

  const setCapacityRange = useCallback((min: number, max: number) => {
    setFilters(prev => ({ ...prev, capacityRange: { min, max } }));
  }, []);

  const setYearRange = useCallback((min: number, max: number) => {
    setFilters(prev => ({ ...prev, yearRange: { min, max } }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const removeFilter = useCallback((filterType: string, value?: string) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      
      switch (filterType) {
        case 'manufacturer':
          if (value) {
            newFilters.manufacturers = prev.manufacturers.filter(m => m !== value);
          } else {
            newFilters.manufacturers = [];
          }
          break;
        case 'localAuthority':
          if (value) {
            newFilters.localAuthorities = prev.localAuthorities.filter(a => a !== value);
          } else {
            newFilters.localAuthorities = [];
          }
          break;
        case 'locationType':
          if (value) {
            newFilters.locationTypes = prev.locationTypes.filter(t => t !== value);
          } else {
            newFilters.locationTypes = [];
          }
          break;
        case 'typeDesignation':
          if (value) {
            newFilters.typeDesignations = prev.typeDesignations.filter(d => d !== value);
          } else {
            newFilters.typeDesignations = [];
          }
          break;
        case 'siteName':
          if (value) {
            newFilters.siteNames = prev.siteNames.filter(s => s !== value);
          } else {
            newFilters.siteNames = [];
          }
          break;
        case 'capacity':
          newFilters.capacityRange = defaultFilters.capacityRange;
          break;
        case 'year':
          newFilters.yearRange = defaultFilters.yearRange;
          break;
      }
      
      return newFilters;
    });
  }, []);

  return {
    filters,
    setManufacturers,
    setLocalAuthorities,
    setLocationTypes,
    setTypeDesignations,
    setSiteNames,
    setCapacityRange,
    setYearRange,
    resetFilters,
    removeFilter,
  };
}
