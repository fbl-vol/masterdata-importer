import { LatLngExpression } from 'leaflet';
import { WindTurbine } from '../types/turbine';

// Denmark's approximate center
export const DENMARK_CENTER: LatLngExpression = [56.26392, 9.501785];
export const DEFAULT_ZOOM = 7;

/**
 * Convert UTM coordinates to latitude/longitude
 * This is a simplified conversion for UTM Zone 32N (Denmark)
 * For production, consider using a library like proj4js
 */
export function utmToLatLng(x: number, y: number): LatLngExpression | null {
  // This is a placeholder - in production you'd use proper UTM conversion
  // For now, we'll assume coordinates might already be in lat/lng or need conversion
  
  // Check if coordinates look like UTM (typically larger values)
  if (x > 180 || y > 90 || x < -180 || y < -90) {
    // Simplified UTM to Lat/Lng conversion for Denmark (Zone 32N)
    // This is approximate and should be replaced with proper conversion
    const lng = ((x - 500000) / 111320) + 9;
    const lat = (y / 111320) - 56;
    
    // Validate the result is within Denmark's approximate bounds
    if (lat >= 54.5 && lat <= 58 && lng >= 8 && lng <= 13) {
      return [lat, lng];
    }
  }
  
  // If coordinates seem reasonable as lat/lng, use them directly
  if (Math.abs(x) <= 180 && Math.abs(y) <= 90) {
    return [y, x]; // Note: Leaflet expects [lat, lng]
  }
  
  return null;
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
