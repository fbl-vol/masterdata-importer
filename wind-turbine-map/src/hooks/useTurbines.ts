import { useState, useEffect } from 'react';
import type { WindTurbine } from '../types/turbine';
import { WindTurbineAPI } from '../services/api';

interface UseTurbinesResult {
  turbines: WindTurbine[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for fetching and managing wind turbine data
 */
export function useTurbines(): UseTurbinesResult {
  const [turbines, setTurbines] = useState<WindTurbine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTurbines = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch all turbines with a large page size
      // In production, you might want to implement pagination or lazy loading
      const data = await WindTurbineAPI.getAllTurbines(1, 10000);
      setTurbines(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch turbines');
      console.error('Error fetching turbines:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTurbines();
  }, []);

  return {
    turbines,
    loading,
    error,
    refetch: fetchTurbines,
  };
}
