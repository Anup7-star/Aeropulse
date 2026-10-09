import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { MapPin, Navigation, Crosshair } from 'lucide-react';
import { PRESET_REGIONS } from '../services/airQualityApi';

export default function MapSelector({ currentRegion, onSelectLocation, aqiInfo }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize Leaflet Map if not already created
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [currentRegion.lat, currentRegion.lon],
        zoom: 10,
        zoomControl: true,
        attributionControl: false
      });

      // 100% Free Public Dark Tile Layer (Zero Watermarks, Zero API Key Required)
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 16,
        subdomains: 'abcd'
      }).addTo(map);

      // Custom Glowing Marker Icon
      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `<div style="
          width: 24px;
          height: 24px;
          background: ${aqiInfo?.color || '#38bdf8'};
          border: 3px solid #ffffff;
          border-radius: 50%;
          box-shadow: 0 0 15px ${aqiInfo?.color || '#38bdf8'};
          animation: pulse-glow 2s infinite ease-in-out;
        "></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = L.marker([currentRegion.lat, currentRegion.lon], { icon: customIcon }).addTo(map);
      markerRef.current = marker;

      // Add preset location pins to map
      PRESET_REGIONS.forEach(preset => {
        const presetIcon = L.divIcon({
          className: 'preset-pin',
          html: `<div style="
            width: 12px;
            height: 12px;
            background: rgba(56, 189, 248, 0.8);
            border: 2px solid #fff;
            border-radius: 50%;
          "></div>`,
          iconSize: [12, 12],
          iconAnchor: [6, 6]
        });

        const pMarker = L.marker([preset.lat, preset.lon], { icon: presetIcon }).addTo(map);
        pMarker.bindTooltip(`<b>${preset.name}</b><br><span style="font-size:10px;">${preset.tag}</span>`, {
          direction: 'top',
          offset: [0, -8]
        });
        pMarker.on('click', () => {
          onSelectLocation(preset);
        });
      });

      // Handle map click to select new location anywhere globally
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        onSelectLocation({
          name: `Custom Location (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`,
          lat: parseFloat(lat.toFixed(4)),
          lon: parseFloat(lng.toFixed(4))
        });
      });

      mapInstanceRef.current = map;
    } else {
      // Update map center and marker position when region changes
      const map = mapInstanceRef.current;
      map.flyTo([currentRegion.lat, currentRegion.lon], 11, { duration: 1.2 });

      if (markerRef.current) {
        markerRef.current.setLatLng([currentRegion.lat, currentRegion.lon]);
        
        // Update marker icon color according to AQI severity
        const updatedIcon = L.divIcon({
          className: 'custom-leaflet-marker',
          html: `<div style="
            width: 24px;
            height: 24px;
            background: ${aqiInfo?.color || '#38bdf8'};
            border: 3px solid #ffffff;
            border-radius: 50%;
            box-shadow: 0 0 20px ${aqiInfo?.color || '#38bdf8'};
            animation: pulse-glow 2s infinite ease-in-out;
          "></div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });
        markerRef.current.setIcon(updatedIcon);
      }
    }
  }, [currentRegion, aqiInfo]);

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          onSelectLocation({
            name: "Your Device Location",
            lat: pos.coords.latitude,
            lon: pos.coords.longitude
          });
        },
        (err) => {
          alert("Unable to retrieve device geolocation. Please click anywhere on the map directly.");
        }
      );
    }
  };

  return (
    <div className="glass-card" style={{ height: '380px', position: 'relative', overflow: 'hidden' }}>
      
      {/* Map Header Overlay */}
      <div style={{ position: 'absolute', top: '12px', left: '12px', right: '12px', zIndex: 900, display: 'flex', justifyContent: 'space-between', alignItems: 'center', pointerEvents: 'none' }}>
        <div style={{ background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(10px)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '0.4rem 0.85rem', pointerEvents: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MapPin size={16} color="var(--accent-cyan)" />
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Interactive Map Selector</span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>(Click anywhere on Earth)</span>
        </div>

        <button
          onClick={handleGetCurrentLocation}
          className="btn-secondary"
          style={{ pointerEvents: 'auto', background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(10px)', padding: '0.45rem 0.75rem', fontSize: '0.78rem' }}
          title="Detect Current GPS Coordinates"
        >
          <Crosshair size={14} color="var(--accent-cyan)" /> My GPS Location
        </button>
      </div>

      {/* Map Container */}
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

      {/* Footer Instructions Overlay */}
      <div style={{ position: 'absolute', bottom: '10px', left: '12px', zIndex: 900, pointerEvents: 'none' }}>
        <div style={{ background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.3rem 0.6rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          Lat: {currentRegion.lat.toFixed(4)}° | Lon: {currentRegion.lon.toFixed(4)}°
        </div>
      </div>
    </div>
  );
}
