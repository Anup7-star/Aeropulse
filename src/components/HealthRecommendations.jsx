import React from 'react';
import { HeartPulse, ShieldAlert, Sun, Wind, Home, Bike, Shield, Filter, CheckCircle2 } from 'lucide-react';
import { getAqiCategory } from '../services/airQualityApi';

export default function HealthRecommendations({ currentAqi }) {
  const category = getAqiCategory(currentAqi);

  let recs = {
    general: "Air quality is good. Great day for outdoor activities, jogging, and natural ventilation.",
    sensitive: "No restrictions needed for sensitive groups.",
    mask: "Mask optional.",
    purifier: "Indoor air filtration not required.",
    eco: "Consider walking or cycling to maintain low ambient emissions."
  };

  if (currentAqi > 50 && currentAqi <= 100) {
    recs = {
      general: "Air quality is acceptable. Unusually sensitive individuals should monitor outdoor endurance.",
      sensitive: "Consider reducing prolonged or heavy outdoor exertion if experiencing symptoms.",
      mask: "Optional outdoors near major traffic intersections.",
      purifier: "Keep windows open during clean afternoon hours.",
      eco: "Use public transport or carpooling to mitigate local ozone build-up."
    };
  } else if (currentAqi > 100 && currentAqi <= 150) {
    recs = {
      general: "General public can engage in normal activities; sensitive individuals should limit prolonged outdoor exposure.",
      sensitive: "Children, elderly, and individuals with respiratory/cardiac conditions should take frequent breaks.",
      mask: "N95 / KN95 respirators recommended for sensitive groups during morning peak hours.",
      purifier: "Run HEPA air purifiers in bedrooms.",
      eco: "Avoid idling vehicles in school zone areas."
    };
  } else if (currentAqi > 150 && currentAqi <= 200) {
    recs = {
      general: "Everyone should reduce prolonged or heavy outdoor exertion. Move outdoor sports indoors.",
      sensitive: "Sensitive groups must avoid outdoor exertion entirely.",
      mask: "N95 / FFP2 mask mandatory for all individuals venturing outdoors.",
      purifier: "Keep doors and windows sealed; operate HEPA air filtration continuously.",
      eco: "Telecommute if possible; minimize high-emission activities."
    };
  } else if (currentAqi > 200) {
    recs = {
      general: "HEALTH WARNING EMERGENCY: Avoid all outdoor physical activity. Stay indoors.",
      sensitive: "Critical hazard for sensitive groups; remain in clean-air filtered environments.",
      mask: "High-efficiency N95/N99 respirator required for any brief essential outdoor movement.",
      purifier: "Run HEPA air purifiers on high mode with activated carbon filters.",
      eco: "Follow official civic emergency pollution alerts and health directives."
    };
  }

  return (
    <div className="glass-card" style={{ padding: '1.75rem', marginTop: '1.5rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <div style={{ background: 'rgba(244, 63, 94, 0.15)', padding: '0.4rem', borderRadius: '10px' }}>
          <HeartPulse size={20} color="#f43f5e" />
        </div>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Practical Health Recommendations & Mitigation Best Practices
          </h2>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Dynamic evidence-based health guidance tailored to active AQI ({currentAqi} — {category.label})
          </div>
        </div>
      </div>

      {/* Grid of Actionable Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        
        {/* General Public Activity */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '1.1rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', textTransform: 'uppercase' }}>
            <Sun size={15} /> Outdoor Physical Activity
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.5rem', lineHeight: 1.4 }}>
            {recs.general}
          </p>
        </div>

        {/* Sensitive Groups */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '1.1rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#fb923c', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', textTransform: 'uppercase' }}>
            <ShieldAlert size={15} /> Sensitive Populations
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.5rem', lineHeight: 1.4 }}>
            {recs.sensitive}
          </p>
        </div>

        {/* Personal Protective Gear / Mask */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '1.1rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#a855f7', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', textTransform: 'uppercase' }}>
            <Shield size={15} /> Respiratory Protection
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.5rem', lineHeight: 1.4 }}>
            {recs.mask}
          </p>
        </div>

        {/* Indoor Air Filtration */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '1.1rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', textTransform: 'uppercase' }}>
            <Filter size={15} /> Indoor Air & HEPA Filtration
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.5rem', lineHeight: 1.4 }}>
            {recs.purifier}
          </p>
        </div>

      </div>

    </div>
  );
}
