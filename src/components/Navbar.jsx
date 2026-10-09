import React, { useState } from 'react';
import { Wind, Search, MapPin, Sparkles, RefreshCw, FileText, User, LogOut, UserPlus, LogIn } from 'lucide-react';
import { PRESET_REGIONS, searchLocation } from '../services/airQualityApi';

export default function Navbar({ 
  currentRegion, 
  onSelectRegion, 
  onRefresh, 
  isLoading, 
  onExportReport,
  user,
  onOpenAuth,
  onLogout
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setShowSearchResults(true);
    const results = await searchLocation(searchQuery);
    setSearchResults(results);
    setIsSearching(false);
  };

  const handleSelectSearchResult = (res) => {
    onSelectRegion({
      name: res.name.split(',')[0],
      displayName: res.name,
      lat: res.lat,
      lon: res.lon
    });
    setShowSearchResults(false);
    setSearchQuery('');
  };

  return (
    <header className="glass-card" style={{ borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none', padding: '0.85rem 1.5rem', position: 'sticky', top: 0, zIndex: 1000 }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ background: 'linear-gradient(135deg, #38bdf8, #3b82f6)', padding: '0.65rem', borderRadius: '12px', display: 'flex', boxShadow: '0 0 15px rgba(56, 189, 248, 0.4)' }}>
            <Wind size={24} color="#fff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="gradient-text" style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                AeroPulse<span style={{ color: '#fff' }}>.AI</span>
              </span>
              <span className="badge badge-good" style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem' }}>
                <Sparkles size={10} /> ML Predictor
              </span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Real-Time Atmospheric Intelligence & Predictive Platform
            </div>
          </div>
        </div>

        {/* Global Search & Location Picker */}
        <div style={{ position: 'relative', flex: 1, maxWidth: '380px', minWidth: '260px' }}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.06)', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '0.2rem 0.5rem' }}>
            <Search size={16} color="var(--text-muted)" style={{ marginLeft: '0.5rem' }} />
            <input
              type="text"
              placeholder="Search any city or region globally (e.g. Chennai, Tokyo, Paris)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchResults.length > 0 && setShowSearchResults(true)}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#fff',
                padding: '0.5rem 0.75rem',
                fontSize: '0.85rem'
              }}
            />
            {isSearching && <RefreshCw size={14} className="spin" color="var(--accent-cyan)" style={{ marginRight: '0.5rem' }} />}
          </form>

          {/* Search Dropdown Results */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="glass-card" style={{ position: 'absolute', top: '115%', left: 0, right: 0, zIndex: 1100, maxHeight: '250px', overflowY: 'auto', padding: '0.5rem' }}>
              {searchResults.map((res, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectSearchResult(res)}
                  style={{
                    padding: '0.5rem 0.75rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    color: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'background 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <MapPin size={14} color="var(--accent-cyan)" />
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{res.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Controls & User Auth Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          
          <select
            value={currentRegion.name}
            onChange={(e) => {
              const selected = PRESET_REGIONS.find(r => r.name === e.target.value);
              if (selected) onSelectRegion(selected);
            }}
            className="btn-secondary"
            style={{ fontSize: '0.82rem', padding: '0.5rem 0.85rem', outline: 'none' }}
          >
            <option value="" disabled style={{ background: '#111827' }}>⚡ Select Preset Region</option>
            {PRESET_REGIONS.map((r, i) => (
              <option key={i} value={r.name} style={{ background: '#111827', color: '#fff' }}>
                📍 {r.name} ({r.tag})
              </option>
            ))}
          </select>

          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="btn-secondary"
            title="Fetch Fresh Air Quality Data"
            style={{ padding: '0.5rem' }}
          >
            <RefreshCw size={16} className={isLoading ? 'spin' : ''} />
          </button>

          <button
            onClick={onExportReport}
            className="btn-secondary"
            style={{ fontSize: '0.82rem' }}
            title="Generate & Print Compliance Evaluation PDF Report"
          >
            <FileText size={15} /> Export PDF
          </button>

          {/* User Auth Profile or Sign In/Sign Up Buttons */}
          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="btn-primary"
                style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem' }}
              >
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#fff', color: '#0f172a', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.68rem' }}>
                  {user.initials || 'U'}
                </div>
                <span>{user.name}</span>
              </button>

              {/* User Menu Dropdown */}
              {showUserMenu && (
                <div className="glass-card" style={{ position: 'absolute', top: '115%', right: 0, width: '220px', padding: '0.85rem', zIndex: 1200 }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>{user.name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>ID: {user.regNo}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', marginTop: '0.15rem' }}>{user.role}</div>
                  <hr style={{ borderColor: 'var(--border-color)', margin: '0.65rem 0' }} />
                  <button
                    onClick={() => { setShowUserMenu(false); onLogout(); }}
                    style={{ background: 'none', border: 'none', color: '#f87171', width: '100%', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button
                onClick={() => onOpenAuth('login')}
                className="btn-secondary"
                style={{ fontSize: '0.82rem', padding: '0.5rem 0.85rem' }}
              >
                <LogIn size={14} /> Sign In
              </button>
              <button
                onClick={() => onOpenAuth('signup')}
                className="btn-primary"
                style={{ fontSize: '0.82rem', padding: '0.5rem 0.85rem' }}
              >
                <UserPlus size={14} /> Sign Up
              </button>
            </div>
          )}

        </div>

      </div>
    </header>
  );
}
