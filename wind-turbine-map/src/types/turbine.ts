// TypeScript types for Wind Turbine data matching the backend model

export interface WindTurbine {
  id: number;
  gsrn: string;
  originalConnectionDate: string | null;
  decommissioningDate: string | null;
  capacityKw: number | null;
  rotorDiameterM: number | null;
  hubHeightM: number | null;
  manufacturer: string | null;
  typeDesignation: string | null;
  localAuthority: string | null;
  locationType: string | null;
  cadastralDistrict: string | null;
  cadastralNo: string | null;
  coordinateX: number | null;
  coordinateY: number | null;
  coordinateOrigin: string | null;
  createdAt: string;
}

export interface TurbineFilters {
  manufacturers: string[];
  localAuthorities: string[];
  locationTypes: string[];
  typeDesignations: string[];
  capacityRange: { min: number; max: number };
  yearRange: { min: number; max: number };
}

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface TurbineStats {
  totalTurbines: number;
  totalCapacityMw: number;
  averageCapacityKw: number;
  manufacturers: number;
  modelTypes: number;
}

export interface ApiStats {
  totalTurbines: number;
  manufacturers: number;
  modelTypes: number;
}
