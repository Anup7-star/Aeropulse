import React from 'react';
import { ShieldCheck, FileCheck, Building2, AlertCircle, Scale, CheckCircle2, ChevronRight } from 'lucide-react';
import { getRegionalComplianceReport } from '../services/complianceData';

export default function ComplianceHub({ regionName, countryName, currentAqi }) {
  const compliance = getRegionalComplianceReport(regionName, countryName, currentAqi);

  return (
    <div className="glass-card" style={{ padding: '1.75rem', marginTop: '1.5rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '0.4rem', borderRadius: '10px' }}>
              <Scale size={20} color="#34d399" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Public Environmental & Regulatory Compliance Hub
              </h2>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Statutory regulatory compliance, industrial emission standards, and policy directives
              </div>
            </div>
          </div>
        </div>

        {/* Compliance Rating Badge */}
        <div style={{ background: compliance.complianceIndex > 70 ? 'rgba(16,185,129,0.15)' : 'rgba(244,63,94,0.15)', border: `1px solid ${compliance.complianceIndex > 70 ? 'rgba(16,185,129,0.3)' : 'rgba(244,63,94,0.3)'}`, borderRadius: '14px', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <FileCheck size={18} color={compliance.complianceIndex > 70 ? '#34d399' : '#f87171'} />
          <div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', uppercase: 'true', fontWeight: 700 }}>
              Compliance Score Index
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: compliance.complianceIndex > 70 ? '#34d399' : '#f87171', lineHeight: 1 }}>
              {compliance.complianceIndex} / 100
            </div>
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        
        {/* Statutory Agency & Legal Framework */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
            Regulatory Oversight
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc' }}>
            {compliance.agency}
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--accent-cyan)', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Building2 size={14} /> Tier: {compliance.industrialEmissionTier}
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.75rem', lineHeight: 1.4 }}>
            <strong>Statutory Framework:</strong> {compliance.legalFramework}
          </p>
        </div>

        {/* Active Directives & Emergency Response */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
            Enforced Environmental Directives
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {compliance.activeDirectives.map((directive, idx) => (
              <div key={idx} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', lineHeight: 1.35 }}>
                <CheckCircle2 size={14} color="#34d399" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span>{directive}</span>
              </div>
            ))}
          </div>
        </div>

        {/* WHO Guideline Adherence */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
            WHO Global Standard Adherence
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <div style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.04)', borderRadius: '8px' }}>
              <div style={{ fontWeight: 700, color: '#f8fafc' }}>PM2.5 Benchmark:</div>
              <div>{compliance.whoAdherence.pm25}</div>
            </div>
            <div style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.04)', borderRadius: '8px' }}>
              <div style={{ fontWeight: 700, color: '#f8fafc' }}>NO2 Benchmark:</div>
              <div>{compliance.whoAdherence.no2}</div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
