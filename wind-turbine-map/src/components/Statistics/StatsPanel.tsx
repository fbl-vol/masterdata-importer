import { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import type { WindTurbine } from '../../types/turbine';
import { calculateStats, groupByCapacity, groupByYear } from '../../utils/filterTurbines';
import './StatsPanel.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface StatsPanelProps {
  turbines: WindTurbine[];
  filteredTurbines: WindTurbine[];
}

export function StatsPanel({ turbines, filteredTurbines }: StatsPanelProps) {
  const stats = useMemo(() => calculateStats(filteredTurbines), [filteredTurbines]);
  const capacityGroups = useMemo(() => groupByCapacity(filteredTurbines), [filteredTurbines]);
  const yearGroups = useMemo(() => groupByYear(filteredTurbines), [filteredTurbines]);

  const capacityChartData = {
    labels: Object.keys(capacityGroups),
    datasets: [
      {
        label: 'Number of Turbines',
        data: Object.values(capacityGroups),
        backgroundColor: '#6366f1',
        borderRadius: 4,
      },
    ],
  };

  // Sort years and prepare chart data
  const sortedYears = Object.keys(yearGroups).sort();
  const yearChartData = {
    labels: sortedYears,
    datasets: [
      {
        label: 'Installations',
        data: sortedYears.map(year => yearGroups[year]),
        backgroundColor: '#10b981',
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#111827',
        padding: 12,
        titleColor: '#fff',
        bodyColor: '#fff',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  return (
    <div className="stats-panel">
      <h2>Statistics</h2>

      {/* Summary Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.totalTurbines}</div>
          <div className="stat-label">Total Turbines</div>
          {filteredTurbines.length < turbines.length && (
            <div className="stat-subtitle">of {turbines.length}</div>
          )}
        </div>

        <div className="stat-card">
          <div className="stat-value">{stats.totalCapacityMw.toFixed(1)} MW</div>
          <div className="stat-label">Total Capacity</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{stats.averageCapacityKw.toFixed(0)} kW</div>
          <div className="stat-label">Avg. Capacity</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{stats.manufacturers}</div>
          <div className="stat-label">Manufacturers</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{stats.modelTypes}</div>
          <div className="stat-label">Model Types</div>
        </div>
      </div>

      {/* Capacity Distribution Chart */}
      <div className="chart-section">
        <h3>Capacity Distribution</h3>
        <div className="chart-container">
          <Bar data={capacityChartData} options={chartOptions} />
        </div>
      </div>

      {/* Year Distribution Chart */}
      {sortedYears.length > 0 && (
        <div className="chart-section">
          <h3>Installation Timeline</h3>
          <div className="chart-container">
            <Bar data={yearChartData} options={chartOptions} />
          </div>
        </div>
      )}
    </div>
  );
}
