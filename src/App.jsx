import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import MapSelector from './components/MapSelector';
import AqiHeroCard from './components/AqiHeroCard';
import PollutantGrid from './components/PollutantGrid';
import MlForecastSection from './components/MlForecastSection';
import PollutionTrendChart from './components/PollutionTrendChart';
import ComplianceHub from './components/ComplianceHub';
import HealthRecommendations from './components/HealthRecommendations';
import AuthModal from './components/AuthModal';

import { 
  PRESET_REGIONS, 
  fetchAirQualityData, 
  reverseGeocode, 
  getAqiCategory 
} from './services/airQualityApi';
import { trainAndPredictMlModel } from './services/mlPredictor';

export default function App() {
  // Default region set to VIT Chennai Campus
  const [currentRegion, setCurrentRegion] = useState(PRESET_REGIONS[0]);
  const [airQualityState, setAirQualityState] = useState(null);
  const [mlResult, setMlResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  // Authentication state stored in localStorage
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('aeropulse_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState('signup');

  // Load telemetry data whenever region coordinates change
  useEffect(() => {
    loadRegionData(currentRegion.lat, currentRegion.lon, currentRegion.name);
  }, [currentRegion.lat, currentRegion.lon]);

  const loadRegionData = async (lat, lon, fallbackName) => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      // 1. Fetch real-time + historical telemetry data
      const data = await fetchAirQualityData(lat, lon, 7);
      
      // 2. Perform reverse geocoding if custom location
      let displayName = fallbackName;
      if (!PRESET_REGIONS.some(p => p.name === fallbackName)) {
        const geo = await reverseGeocode(lat, lon);
        displayName = geo.displayName;
      }

      data.regionDisplayName = displayName;
      setAirQualityState(data);

      // 3. Train ML Model on historical time-series telemetry
      if (data.historical && data.historical.length > 0) {
        const ml = trainAndPredictMlModel(data.historical, 48);
        setMlResult(ml);
      }
    } catch (err) {
      console.error("Error loading region telemetry:", err);
      setErrorMsg("Failed to retrieve air quality telemetry for the selected location.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectLocation = (newRegion) => {
    setCurrentRegion(newRegion);
  };

  const handleRefresh = () => {
    loadRegionData(currentRegion.lat, currentRegion.lon, currentRegion.name);
  };

  const handleExportPDF = () => {
    window.print();
  };

  const handleOpenAuth = (tab = 'signup') => {
    setAuthInitialTab(tab);
    setIsAuthOpen(true);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('aeropulse_user');
  };

  const currentData = airQualityState?.current;
  const aqiInfo = currentData ? getAqiCategory(currentData.aqi) : null;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Navbar with Sign Up / Sign In controls */}
      <Navbar
        currentRegion={currentRegion}
        onSelectRegion={handleSelectLocation}
        onRefresh={handleRefresh}
        isLoading={isLoading}
        onExportReport={handleExportPDF}
        user={user}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
      />

      {/* Main Dashboard Layout */}
      <main style={{ flex: 1, maxWidth: '1400px', width: '100%', margin: '0 auto', padding: '1.5rem 1rem 3rem 1rem' }}>
        
        {/* User Welcome Banner if logged in */}
        {user && (
          <div style={{ background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '12px', padding: '0.65rem 1.25rem', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.82rem' }}>
            <div>
              👋 Welcome, <strong style={{ color: '#fff' }}>{user.name}</strong> ({user.regNo}) • <span style={{ color: 'var(--accent-cyan)' }}>{user.role}</span>
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
              Logged in Session Active
            </div>
          </div>
        )}

        {/* Loading Overlay Bar */}
        {isLoading && (
          <div style={{ background: 'rgba(56, 189, 248, 0.1)', border: '1px solid var(--accent-cyan)', color: 'var(--accent-cyan)', borderRadius: '12px', padding: '0.75rem 1.25rem', marginBottom: '1.5rem', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="spin">⚡</span> Fetching real-time open-source air quality telemetry and training ML predictive model for {currentRegion.name}...
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div style={{ background: 'rgba(244, 63, 94, 0.15)', border: '1px solid #f43f5e', color: '#f87171', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Section 1: Hero & Map Selection Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem', alignItems: 'stretch' }}>
          
          {/* Left Column: AQI Real-Time Hero Card */}
          <AqiHeroCard
            currentData={currentData}
            regionName={airQualityState?.regionDisplayName || currentRegion.name}
            countryName={currentRegion.country}
            dataSource={airQualityState?.source || "Open-Meteo Air Quality API"}
          />

          {/* Right Column: Interactive Map Selector */}
          <MapSelector
            currentRegion={currentRegion}
            onSelectLocation={handleSelectLocation}
            aqiInfo={aqiInfo}
          />

        </div>

        {/* Section 2: Pollutant Matrix (PM2.5, PM10, NO2, SO2, O3, CO) */}
        <PollutantGrid currentData={currentData} />

        {/* Section 3: Machine Learning Prediction Dashboard */}
        <MlForecastSection mlResult={mlResult} />

        {/* Section 4: Time-Series Historical vs Predicted Chart */}
        <PollutionTrendChart
          historicalData={airQualityState?.historical}
          mlPredictions={mlResult?.predictions}
        />

        {/* Section 5: Environmental Regulatory Compliance Hub */}
        <ComplianceHub
          regionName={airQualityState?.regionDisplayName || currentRegion.name}
          countryName={currentRegion.country}
          currentAqi={currentData?.aqi}
        />

        {/* Section 6: Actionable Health Recommendations */}
        <HealthRecommendations currentAqi={currentData?.aqi} />

      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '1.5rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', background: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <strong>AeroPulse AI</strong> — Real-Time Air Quality Monitoring & ML Prediction Engine
          </div>
          <div>
            Live Telemetry Platform
          </div>
        </div>
      </footer>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(userData) => setUser(userData)}
      />

    </div>
  );
}
