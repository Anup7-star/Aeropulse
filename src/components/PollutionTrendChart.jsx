import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Calendar, BarChart2 } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function PollutionTrendChart({ historicalData, mlPredictions }) {
  const [timeWindow, setTimeWindow] = useState('7d'); // '24h', '7d', '30d'
  const [selectedPollutant, setSelectedPollutant] = useState('aqi'); // 'aqi', 'pm2_5', 'no2', 'pm10'

  if (!historicalData || historicalData.length === 0) return null;

  // Filter historical points based on time window
  let filteredHistory = [...historicalData];
  if (timeWindow === '24h') {
    filteredHistory = historicalData.slice(-24);
  } else if (timeWindow === '7d') {
    filteredHistory = historicalData.slice(-168);
  }

  // Combine historical + future ML predictions
  const labels = [
    ...filteredHistory.map(h => {
      const d = new Date(h.time);
      return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:00`;
    }),
    ...(mlPredictions ? mlPredictions.slice(0, 24).map(p => `[Pred] ${p.timeDisplay}`) : [])
  ];

  const historicalValues = filteredHistory.map(h => h[selectedPollutant] ?? h.aqi);
  const predictedValues = [
    ...Array(filteredHistory.length - 1).fill(null),
    historicalValues[historicalValues.length - 1], // bridge point
    ...(mlPredictions ? mlPredictions.slice(0, 24).map(p => selectedPollutant === 'pm2_5' ? p.predictedPm25 : p.predictedAqi) : [])
  ];

  const pollutantLabels = {
    aqi: 'US Air Quality Index (AQI)',
    pm2_5: 'PM2.5 Concentration (µg/m³)',
    no2: 'Nitrogen Dioxide NO2 (µg/m³)',
    pm10: 'PM10 Concentration (µg/m³)'
  };

  const chartData = {
    labels,
    datasets: [
      {
        label: `Historical Telemetry (${selectedPollutant.toUpperCase()})`,
        data: [...historicalValues, ...Array(mlPredictions ? 24 : 0).fill(null)],
        borderColor: '#38bdf8',
        backgroundColor: 'rgba(56, 189, 248, 0.1)',
        fill: true,
        tension: 0.35,
        borderWidth: 2,
        pointRadius: 2,
        pointHoverRadius: 6
      },
      {
        label: `ML Predicted Horizon (${selectedPollutant.toUpperCase()})`,
        data: predictedValues,
        borderColor: '#a855f7',
        borderDash: [6, 4],
        backgroundColor: 'rgba(168, 85, 247, 0.08)',
        fill: true,
        tension: 0.35,
        borderWidth: 2.5,
        pointRadius: 3,
        pointHoverRadius: 7
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#94a3b8',
          font: { family: 'Outfit', size: 12 }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#38bdf8',
        bodyColor: '#f8fafc',
        borderColor: 'rgba(56, 189, 248, 0.3)',
        borderWidth: 1,
        padding: 12
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#64748b', maxRotation: 45, font: { size: 10 } }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#64748b', font: { size: 11 } }
      }
    }
  };

  return (
    <div className="glass-card" style={{ padding: '1.75rem', marginTop: '1.5rem' }}>
      
      {/* Header & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart2 size={20} color="var(--accent-purple)" /> Historical Telemetry & Predictive Forecast Chart
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {pollutantLabels[selectedPollutant]} over selected historical observation window.
          </p>
        </div>

        {/* Time Window Buttons + Pollutant Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          
          <select
            value={selectedPollutant}
            onChange={(e) => setSelectedPollutant(e.target.value)}
            className="btn-secondary"
            style={{ fontSize: '0.8rem', padding: '0.45rem 0.75rem' }}
          >
            <option value="aqi" style={{ background: '#111827' }}>US AQI</option>
            <option value="pm2_5" style={{ background: '#111827' }}>PM2.5</option>
            <option value="no2" style={{ background: '#111827' }}>NO2</option>
            <option value="pm10" style={{ background: '#111827' }}>PM10</option>
          </select>

          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '0.2rem', border: '1px solid var(--border-color)' }}>
            <button
              onClick={() => setTimeWindow('24h')}
              className={`btn-secondary ${timeWindow === '24h' ? 'active' : ''}`}
              style={{ border: 'none', padding: '0.35rem 0.75rem', fontSize: '0.78rem', borderRadius: '8px' }}
            >
              24 Hours
            </button>
            <button
              onClick={() => setTimeWindow('7d')}
              className={`btn-secondary ${timeWindow === '7d' ? 'active' : ''}`}
              style={{ border: 'none', padding: '0.35rem 0.75rem', fontSize: '0.78rem', borderRadius: '8px' }}
            >
              7 Days
            </button>
          </div>

        </div>
      </div>

      {/* Chart Canvas Container */}
      <div style={{ height: '340px', width: '100%', position: 'relative' }}>
        <Line data={chartData} options={chartOptions} />
      </div>

    </div>
  );
}
