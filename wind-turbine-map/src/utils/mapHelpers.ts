import type { LatLngExpression } from 'leaflet';
import type { WindTurbine } from '../types/turbine';
import proj4 from 'proj4';

// Denmark's approximate center
export const DENMARK_CENTER: LatLngExpression = [56.26392, 9.501785];
export const DEFAULT_ZOOM = 7;

/**
 * Convert UTM coordinates to latitude/longitude
 * This is a simplified conversion for UTM Zone 32N (Denmark)
 * For production, consider using a library like proj4js
 */
export function utmToLatLng(easting: number, northing: number): LatLngExpression | null {
    const zone = 32;
    const isNorthHemisphere = true;

// Create the UTM projection string
    const utmProj = `+proj=utm +zone=${zone} +${isNorthHemisphere ? 'north' : 'south'} +ellps=WGS84 +datum=WGS84 +units=m +no_defs`;

// Define the WGS84 (lat/long) projection
    const wgs84Proj = '+proj=longlat +datum=WGS84 +no_defs';
    
// Convert UTM to Lat/Lng
    const [longitude, latitude] = proj4(utmProj, wgs84Proj, [easting, northing]);

    console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
    
    if (isNaN(latitude) || isNaN(longitude)) {
        return null;
    }
    
    return [latitude, longitude];
}



/**
 * Get marker color based on turbine properties
 */
export function getMarkerColor(turbine: WindTurbine, colorBy: 'manufacturer' | 'age' | 'capacity'): string {
  switch (colorBy) {
    case 'manufacturer':
      return getManufacturerColor(turbine.manufacturer);
    case 'age':
      return getAgeColor(turbine.originalConnectionDate);
    case 'capacity':
      return getCapacityColor(turbine.capacityKw);
    default:
      return '#3b82f6'; // blue
  }
}

function getManufacturerColor(manufacturer: string | null): string {
  if (!manufacturer) return '#6b7280'; // gray
  
  // Simple hash function to generate consistent colors
  const hash = manufacturer.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  const colors = [
    '#3b82f6', // blue
    '#10b981', // green
    '#f59e0b', // amber
    '#ef4444', // red
    '#8b5cf6', // violet
    '#ec4899', // pink
    '#14b8a6', // teal
    '#f97316', // orange
  ];
  
  return colors[Math.abs(hash) % colors.length];
}

function getAgeColor(connectionDate: string | null): string {
  if (!connectionDate) return '#6b7280'; // gray
  
  const year = new Date(connectionDate).getFullYear();
  const currentYear = new Date().getFullYear();
  const age = currentYear - year;
  
  if (age < 2) return '#10b981'; // green - very new
  if (age < 5) return '#3b82f6'; // blue - recent
  if (age < 10) return '#f59e0b'; // amber - moderate
  return '#ef4444'; // red - old
}

function getCapacityColor(capacityKw: number | null): string {
  if (!capacityKw) return '#6b7280'; // gray
  
  const capacityMw = capacityKw / 1000;
  
  if (capacityMw < 1) return '#ef4444'; // red - very small
  if (capacityMw < 2) return '#f59e0b'; // amber - small
  if (capacityMw < 3) return '#3b82f6'; // blue - medium
  if (capacityMw < 4) return '#8b5cf6'; // violet - large
  return '#10b981'; // green - very large
}

/**
 * Format capacity for display
 */
export function formatCapacity(capacityKw: number | null): string {
  if (!capacityKw) return 'N/A';
  
  if (capacityKw >= 1000) {
    return `${(capacityKw / 1000).toFixed(2)} MW`;
  }
  
  return `${capacityKw} kW`;
}

/**
 * Format date for display
 */
export function formatDate(dateString: string | null): string {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-DK', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}
