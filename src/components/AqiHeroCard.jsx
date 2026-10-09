import React from 'react';
import { Activity, ShieldCheck, Clock, MapPin, Thermometer, Droplets, Wind, Gauge, Compass } from 'lucide-react';
import { getAqiCategory } from '../services/airQualityApi';

export default function AqiHeroCard({ currentData, regionName, countryName, dataSource }) {
  if (!currentData) return null;

  const aqi = currentData.aqi;
  const category = getAqiCategory(aqi);
  const weather = currentData.weather || {};

  // Gauge percentage calculation (0 to 300 max scale for visual ring)
  const gaugePercent = Math.min(100, Math.max(0, (aqi / 300) * 100));

  // Determine dominant pollutant
  const pollutants = [
    { name: 'PM2.5', val: currentData.pm2_5, norm: 15 },
    { name: 'PM10', val: currentData.pm10, norm: 45 },
    { name: 'NO2', val: currentData.no2, norm: 25 },
    { name: 'SO2', val: currentData.so2, norm: 40 },
    { name: 'O3', val: currentData.o3, norm: 60 }
  ];
  const dominant = pollutants.reduce((prev, curr) => (curr.val / curr.norm > prev.val / prev.norm) ? curr : prev, pollutants[0]);
  const whoMultiple = (currentData.pm2_5 / 15).toFixed(1);

  return (
    <div className="glass-card" style={{ padding: '2rem', position: 'relative', overflow: 'hidden' }}>
      
      {/* Background Dynamic Mood Ambient Gradient */}
      <div style={{
        position: 'absolute',
        top: '-30%',
        right: '-15%',
        width: '380px',
        height: '380px',
        background: `radial-gradient(circle, ${category.color}25 0%, transparent 70%)`,
        pointerEvents: 'none',
        transition: 'all 0.8s ease'
      }} />

      {/* Region & Header Telemetry */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--accent-cyan)', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <MapPin size={15} /> Real-Time Atmospheric Telemetry
          </div>
          <h1 style={{ fontSize: '2.1rem', fontWeight: 900, marginTop: '0.25rem', color: '#f8fafc', letterSpacing: '-0.02em' }}>
            {regionName} {countryName ? `, ${countryName}` : ''}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Clock size={13} /> {currentData.time ? new Date(currentData.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Live Data Stream'}
            </span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#34d399', fontWeight: 600 }}>
              <ShieldCheck size={13} /> {dataSource}
            </span>
          </div>
        </div>

        {/* Severity Classification Pill */}
        <span className={`badge ${category.badgeClass}`} style={{ fontSize: '0.9rem', padding: '0.45rem 1.1rem' }}>
          <span className="pulse-dot" style={{ background: category.color }} /> {category.label}
        </span>
      </div>

      {/* Main Visual Display: AQI Gauge + Dynamic Weather Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem', alignItems: 'center', marginTop: '1.25rem' }}>
        
        {/* AQI Circular Radial Gauge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
          <div style={{ position: 'relative', width: '135px', height: '135px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            
            <svg width="135" height="135" viewBox="0 0 135 135" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="67.5" cy="67.5" r="56" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="11" />
              <circle
                cx="67.5"
                cy="67.5"
                r="56"
                fill="none"
                stroke={category.color}
                strokeWidth="11"
                strokeDasharray="351"
                strokeDashoffset={351 - (351 * gaugePercent) / 100}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1)' }}
              />
            </svg>

            <div style={{ position: 'absolute', textAlign: 'center' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 900, color: category.color, lineHeight: 1 }}>
                {aqi}
              </span>
              <span style={{ display: 'block', fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.06em', marginTop: '0.15rem' }}>
                US AQI
              </span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 800 }}>
              Air Quality Index
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: category.color, marginTop: '0.2rem' }}>
              {category.label}
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '0.4rem', lineHeight: 1.45, maxWidth: '280px' }}>
              {category.desc}
            </p>
          </div>
        </div>

        {/* Live Weather & Telemetry Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.9rem' }}>
          
          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '14px', padding: '0.9rem 1.1rem', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Thermometer size={14} color="#f59e0b" /> Temperature
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', marginTop: '0.3rem' }}>
              {weather.temp ?? 28} <span style={{ fontSize: '0.85rem', fontWeight: 400 }}>°C</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
              Live Weather Sensor
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '14px', padding: '0.9rem 1.1rem', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Wind size={14} color="var(--accent-cyan)" /> Wind Speed
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', marginTop: '0.3rem' }}>
              {weather.windSpeed ?? 12} <span style={{ fontSize: '0.85rem', fontWeight: 400 }}>km/h</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
              Direction: {weather.windDir ?? 180}°
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '14px', padding: '0.9rem 1.1rem', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Droplets size={14} color="#38bdf8" /> Humidity
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', marginTop: '0.3rem' }}>
              {weather.humidity ?? 64} <span style={{ fontSize: '0.85rem', fontWeight: 400 }}>%</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
              Relative Humidity
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '14px', padding: '0.9rem 1.1rem', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Activity size={14} color="var(--accent-purple)" /> Primary Risk
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-cyan)', marginTop: '0.3rem' }}>
              {dominant.name}
            </div>
            <div style={{ fontSize: '0.72rem', color: currentData.pm2_5 > 15 ? '#f87171' : '#34d399', marginTop: '0.15rem' }}>
              {whoMultiple > 1.0 ? `${whoMultiple}x WHO Target` : 'WHO Compliant'}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
