import React from 'react';
import { Wind, ShieldAlert, AlertCircle, CheckCircle, Info } from 'lucide-react';

export default function PollutantGrid({ currentData }) {
  if (!currentData) return null;

  // WHO Guidelines threshold values (in µg/m³ 24-hour mean)
  const pollutantsList = [
    {
      id: 'pm2_5',
      name: 'PM2.5',
      fullName: 'Fine Particulate Matter (< 2.5 µm)',
      val: currentData.pm2_5,
      unit: 'µg/m³',
      whoLimit: 15,
      color: '#38bdf8',
      desc: 'Inhalable fine particles that penetrate deep into lungs and lungs airflow.'
    },
    {
      id: 'pm10',
      name: 'PM10',
      fullName: 'Coarse Particulate Matter (< 10 µm)',
      val: currentData.pm10,
      unit: 'µg/m³',
      whoLimit: 45,
      color: '#818cf8',
      desc: 'Coarse inhalable particles from dust, construction, and road traffic.'
    },
    {
      id: 'no2',
      name: 'NO2',
      fullName: 'Nitrogen Dioxide',
      val: currentData.no2,
      unit: 'µg/m³',
      whoLimit: 25,
      color: '#fbbf24',
      desc: 'Emitted from internal combustion vehicular exhaust and thermal energy.'
    },
    {
      id: 'so2',
      name: 'SO2',
      fullName: 'Sulphur Dioxide',
      val: currentData.so2,
      unit: 'µg/m³',
      whoLimit: 40,
      color: '#f43f5e',
      desc: 'Produced by industrial fossil fuel combustion and refining operations.'
    },
    {
      id: 'o3',
      name: 'O3',
      fullName: 'Ground-Level Ozone',
      val: currentData.o3,
      unit: 'µg/m³',
      whoLimit: 100,
      color: '#c084fc',
      desc: 'Secondary pollutant formed by sunlight reacting with NOx and VOC emissions.'
    },
    {
      id: 'co',
      name: 'CO',
      fullName: 'Carbon Monoxide',
      val: currentData.co,
      unit: 'µg/m³',
      whoLimit: 4000,
      color: '#34d399',
      desc: 'Colorless, odorless gas produced by incomplete combustion of fossil fuels.'
    }
  ];

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Wind size={20} color="var(--accent-cyan)" /> Telemetry Pollutant Matrix & WHO Standards
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Real-time concentration levels benchmarked against World Health Organization (WHO 2021) 24-hour safety guidelines.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        {pollutantsList.map((p) => {
          const ratio = p.val / p.whoLimit;
          const isExceeded = ratio > 1.0;
          const percentVal = Math.min(100, Math.round((p.val / (p.whoLimit * 2)) * 100));

          return (
            <div key={p.id} className="glass-card glass-card-interactive" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: p.color }}>
                    {p.name}
                  </span>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500, marginTop: '0.1rem' }}>
                    {p.fullName}
                  </div>
                </div>

                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.6rem',
                    borderRadius: '12px',
                    background: isExceeded ? 'rgba(244,63,94,0.15)' : 'rgba(16,185,129,0.15)',
                    color: isExceeded ? '#f87171' : '#34d399',
                    border: `1px solid ${isExceeded ? 'rgba(244,63,94,0.3)' : 'rgba(16,185,129,0.3)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                >
                  {isExceeded ? <AlertCircle size={12} /> : <CheckCircle size={12} />}
                  {isExceeded ? `${ratio.toFixed(1)}x WHO Limit` : 'WHO Safe'}
                </span>
              </div>

              {/* Value & Unit */}
              <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
                <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', lineHeight: 1 }}>
                  {p.val}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  {p.unit}
                </span>
              </div>

              {/* Visual Progress Bar against WHO Limit */}
              <div style={{ marginTop: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                  <span>0</span>
                  <span>WHO Target: {p.whoLimit} {p.unit}</span>
                </div>
                <div className="progress-bar-bg">
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${percentVal}%`,
                      background: isExceeded ? 'linear-gradient(90deg, #f59e0b, #f43f5e)' : 'linear-gradient(90deg, #10b981, #38bdf8)'
                    }}
                  />
                </div>
              </div>

              {/* Explanation Note */}
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.75rem', lineHeight: 1.35 }}>
                {p.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
