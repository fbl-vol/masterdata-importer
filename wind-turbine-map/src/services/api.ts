import type { WindTurbine, ApiStats } from '../types/turbine';

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// API service for fetching wind turbine data
export class WindTurbineAPI {
  
  /**
   * Get all wind turbines with pagination
   */
  static async getAllTurbines(page = 1, pageSize = 10000): Promise<WindTurbine[]> {
    const response = await fetch(`${API_BASE_URL}/windturbines?page=${page}&pageSize=${pageSize}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch turbines: ${response.statusText}`);
    }
    
    return response.json();
  }

  /**
   * Get a single turbine by GSRN
   */
  static async getTurbineByGsrn(gsrn: string): Promise<WindTurbine> {
    const response = await fetch(`${API_BASE_URL}/windturbines/gsrn/${gsrn}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch turbine: ${response.statusText}`);
    }
    
    return response.json();
  }

  /**
   * Get turbines by manufacturer
   */
  static async getTurbinesByManufacturer(
    manufacturer: string, 
    page = 1, 
    pageSize = 1000
  ): Promise<WindTurbine[]> {
    const response = await fetch(
      `${API_BASE_URL}/windturbines/manufacturer/${encodeURIComponent(manufacturer)}?page=${page}&pageSize=${pageSize}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch turbines: ${response.statusText}`);
    }
    
    return response.json();
  }

  /**
   * Get turbines by model type
   */
  static async getTurbinesByModel(
    modelType: string, 
    page = 1, 
    pageSize = 1000
  ): Promise<WindTurbine[]> {
    const response = await fetch(
      `${API_BASE_URL}/windturbines/model/${encodeURIComponent(modelType)}?page=${page}&pageSize=${pageSize}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch turbines: ${response.statusText}`);
    }
    
    return response.json();
  }

  /**
   * Get database statistics
   */
  static async getStatistics(): Promise<ApiStats> {
    const response = await fetch(`${API_BASE_URL}/windturbines/stats`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch statistics: ${response.statusText}`);
    }
    
    return response.json();
  }

  /**
   * Get multiple turbines by GSRN list
   */
  static async getTurbinesByGsrnList(gsrnList: string[]): Promise<WindTurbine[]> {
    const response = await fetch(`${API_BASE_URL}/windturbines/gsrn/batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(gsrnList),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch turbines: ${response.statusText}`);
    }
    
    return response.json();
  }
}
