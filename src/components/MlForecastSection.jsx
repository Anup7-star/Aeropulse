import React from 'react';
import { Cpu, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, BarChart2, Zap, Target } from 'lucide-react';
import { getAqiCategory } from '../services/airQualityApi';

export default function MlForecastSection({ mlResult }) {
  if (!mlResult || mlResult.error) {
    return (
      <div className="glass-card" style={{ padding: '1.5rem', marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <Cpu size={24} style={{ marginBottom: '0.5rem' }} />
        <p>Insufficient telemetry data points to train ML Forecasting Model.</p>
      </div>
    );
  }

  const { metrics, trendAnalysis, predictions, modelName } = mlResult;
  const isDeteriorating = trendAnalysis.delta24h > 5;

  return (
    <div className="glass-card" style={{ padding: '1.75rem', marginTop: '1.5rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ background: 'rgba(56, 189, 248, 0.15)', padding: '0.4rem', borderRadius: '10px' }}>
              <Cpu size={20} color="var(--accent-cyan)" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Machine Learning Air Quality Predictive Engine
              </h2>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {modelName} • Trained on historical hourly telemetry data
              </div>
            </div>
          </div>
        </div>

        {/* Model Accuracy Badge */}
        <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '14px', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <Target size={18} color="#34d399" />
          <div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', uppercase: 'true', fontWeight: 700 }}>
              Model Fit (R² Score)
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#34d399', lineHeight: 1 }}>
              {(metrics.rSquared * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {/* 3 Metric Insight Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        
        {/* Trend Forecast Card */}
        <div style={{ background: isDeteriorating ? 'rgba(244,63,94,0.08)' : 'rgba(16,185,129,0.08)', border: `1px solid ${isDeteriorating ? 'rgba(244,63,94,0.3)' : 'rgba(16,185,129,0.3)'}`, borderRadius: '14px', padding: '1.1rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {isDeteriorating ? <TrendingUp size={16} color="#f87171" /> : <TrendingDown size={16} color="#34d399" />}
            24-Hour Predictive Direction
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: isDeteriorating ? '#f87171' : '#34d399', marginTop: '0.35rem' }}>
            {trendAnalysis.next24hAvg} US AQI Avg
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            {trendAnalysis.delta24h > 0 ? `+${trendAnalysis.delta24h}` : trendAnalysis.delta24h} AQI vs Current ({trendAnalysis.trendDirection})
          </div>
        </div>

        {/* Peak Pollution Alert Hour */}
        <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '14px', padding: '1.1rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <AlertTriangle size={16} color="#fbbf24" />
            Predicted Peak Pollution Window
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fbbf24', marginTop: '0.35rem' }}>
            Peak AQI {trendAnalysis.peakAqi}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Expected around <strong style={{ color: '#fff' }}>{trendAnalysis.peakTime}</strong>
          </div>
        </div>

        {/* Statistical Loss Error Metrics */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '1.1rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <BarChart2 size={16} color="var(--accent-purple)" />
            Model Regression Loss Metrics
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <span>RMSE: <strong style={{ color: '#fff' }}>{metrics.rmse}</strong></span>
            <span>MSE: <strong style={{ color: '#fff' }}>{metrics.mse}</strong></span>
            <span>MAE: <strong style={{ color: '#fff' }}>{metrics.mae}</strong></span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Evaluated over {mlResult.trainingSize} historical hours
          </div>
        </div>

      </div>

      {/* Hourly Forecast Timeline Strip */}
      <div>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Zap size={15} color="var(--accent-cyan)" /> Next 24-Hour ML Hourly Forecast Horizon
        </div>

        <div style={{ display: 'flex', gap: '0.65rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {predictions.slice(0, 24).map((p, idx) => {
            const cat = getAqiCategory(p.predictedAqi);
            return (
              <div
                key={idx}
                style={{
                  minWidth: '85px',
                  background: p.isPeak ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${p.isPeak ? '#fbbf24' : 'var(--border-color)'}`,
                  borderRadius: '12px',
                  padding: '0.65rem',
                  textAlign: 'center',
                  flexShrink: 0
                }}
              >
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  {p.timeDisplay.split(' ')[1]}
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: cat.color, margin: '0.2rem 0' }}>
                  {p.predictedAqi}
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>
                  PM2.5: {p.predictedPm25}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
