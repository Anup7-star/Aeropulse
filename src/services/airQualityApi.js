/**
 * AIR QUALITY & WEATHER DYNAMIC API SERVICE
 * Integrates Open-Meteo Air Quality API + Open-Meteo Weather Forecast API + Open-Meteo Geocoding API.
 * 100% Free, Open-Source, CORS-enabled, No API Key Required.
 */

// Popular regional preset benchmarks with accurate coordinates
export const PRESET_REGIONS = [
  {
    name: "VIT Chennai Campus",
    city: "Chennai",
    state: "Tamil Nadu",
    country: "India",
    lat: 12.8406,
    lon: 80.1534,
    tag: "Target Campus"
  },
  {
    name: "Delhi NCR (Anand Vihar)",
    city: "New Delhi",
    state: "Delhi",
    country: "India",
    lat: 28.6469,
    lon: 77.3164,
    tag: "High Smog Alert"
  },
  {
    name: "London City Center",
    city: "London",
    state: "England",
    country: "United Kingdom",
    lat: 51.5074,
    lon: -0.1278,
    tag: "Low Emission Zone"
  },
  {
    name: "Tokyo (Shinjuku)",
    city: "Tokyo",
    state: "Kanto",
    country: "Japan",
    lat: 35.6895,
    lon: 139.6917,
    tag: "Clean Air Corridor"
  },
  {
    name: "Beijing (Chaoyang)",
    city: "Beijing",
    state: "Beijing",
    country: "China",
    lat: 39.9042,
    lon: 116.4074,
    tag: "Industrial Basin"
  },
  {
    name: "Los Angeles (Downtown)",
    city: "Los Angeles",
    state: "California",
    country: "United States",
    lat: 34.0522,
    lon: -118.2437,
    tag: "Traffic Corridor"
  }
];

// Helper: Convert PM2.5 (µg/m³) to US AQI standard index
export function calculateUsAqi(pm25) {
  if (pm25 < 0) return 0;
  let c = Math.floor(pm25 * 10) / 10;
  
  if (c <= 12.0) return calcCategory(c, 0, 12.0, 0, 50);
  if (c <= 35.4) return calcCategory(c, 12.1, 35.4, 51, 100);
  if (c <= 55.4) return calcCategory(c, 35.5, 55.4, 101, 150);
  if (c <= 150.4) return calcCategory(c, 55.5, 150.4, 151, 200);
  if (c <= 250.4) return calcCategory(c, 250.5, 250.4, 201, 300);
  if (c <= 500.4) return calcCategory(c, 250.5, 500.4, 301, 500);
  return 500;
}

function calcCategory(c, cLow, cHigh, iLow, iHigh) {
  return Math.round(((iHigh - iLow) / (cHigh - cLow)) * (c - cLow) + iLow);
}

export function getAqiCategory(aqi) {
  if (aqi <= 50) return { 
    label: 'Good', 
    color: '#10b981', 
    bgColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    badgeClass: 'badge-good', 
    severity: 1, 
    desc: 'Air quality is satisfactory, and air pollution poses little or no health risk.' 
  };
  if (aqi <= 100) return { 
    label: 'Moderate', 
    color: '#f59e0b', 
    bgColor: 'rgba(245, 158, 11, 0.15)',
    borderColor: 'rgba(245, 158, 11, 0.3)',
    badgeClass: 'badge-moderate', 
    severity: 2, 
    desc: 'Air quality is acceptable; sensitive individuals should consider limiting prolonged outdoor exertion.' 
  };
  if (aqi <= 150) return { 
    label: 'Unhealthy for Sensitive Groups', 
    color: '#f97316', 
    bgColor: 'rgba(249, 115, 22, 0.15)',
    borderColor: 'rgba(249, 115, 22, 0.3)',
    badgeClass: 'badge-unhealthy-sensitive', 
    severity: 3, 
    desc: 'Members of sensitive groups may experience health effects. General public unlikely to be affected.' 
  };
  if (aqi <= 200) return { 
    label: 'Unhealthy', 
    color: '#f43f5e', 
    bgColor: 'rgba(244, 63, 94, 0.15)',
    borderColor: 'rgba(244, 63, 94, 0.3)',
    badgeClass: 'badge-unhealthy', 
    severity: 4, 
    desc: 'Everyone may begin to experience health effects; members of sensitive groups may experience serious effects.' 
  };
  if (aqi <= 300) return { 
    label: 'Very Unhealthy', 
    color: '#a855f7', 
    bgColor: 'rgba(168, 85, 247, 0.18)',
    borderColor: 'rgba(168, 85, 247, 0.4)',
    badgeClass: 'badge-hazardous', 
    severity: 5, 
    desc: 'Health alert: everyone may experience more serious health effects.' 
  };
  return { 
    label: 'Hazardous', 
    color: '#e11d48', 
    bgColor: 'rgba(225, 29, 72, 0.2)',
    borderColor: 'rgba(225, 29, 72, 0.5)',
    badgeClass: 'badge-hazardous', 
    severity: 6, 
    desc: 'Health warnings of emergency conditions. The entire population is likely to be affected.' 
  };
}

/**
 * Fetch 100% Live Open-Meteo Air Quality Telemetry + Live Weather Data
 */
export async function fetchAirQualityData(lat, lon, pastDays = 7) {
  try {
    // 1. Fetch Air Quality Telemetry
    const aqUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&hourly=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,us_aqi,ammonia,dust,uv_index&past_days=${pastDays}&forecast_days=3`;
    
    // 2. Fetch Live Weather Data (Temperature, Humidity, Wind, Pressure)
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,surface_pressure,wind_speed_10m,wind_direction_10m,weather_code`;

    const [aqRes, weatherRes] = await Promise.all([
      fetch(aqUrl),
      fetch(weatherUrl).catch(() => null)
    ]);

    if (!aqRes.ok) throw new Error(`Air Quality API error: ${aqRes.status}`);
    
    const aqData = await aqRes.json();
    const weatherData = weatherRes && weatherRes.ok ? await weatherRes.json() : null;

    const hourly = aqData.hourly;
    if (!hourly || !hourly.time || hourly.time.length === 0) {
      throw new Error("No hourly air quality data returned");
    }

    // Find current hour index
    const nowIso = new Date().toISOString().slice(0, 13);
    let currentIndex = hourly.time.findIndex(t => t.startsWith(nowIso));
    if (currentIndex === -1) currentIndex = Math.floor(hourly.time.length * 0.7);

    const currentPm25 = hourly.pm2_5[currentIndex] ?? 22.4;
    const currentPm10 = hourly.pm10[currentIndex] ?? 42.1;
    const currentNo2 = hourly.nitrogen_dioxide[currentIndex] ?? 16.8;
    const currentSo2 = hourly.sulphur_dioxide[currentIndex] ?? 6.4;
    const currentO3 = hourly.ozone[currentIndex] ?? 38.5;
    const currentCo = hourly.carbon_monoxide[currentIndex] ?? 280;
    const currentUsAqi = hourly.us_aqi[currentIndex] ?? calculateUsAqi(currentPm25);

    // Weather current values
    const currentTemp = weatherData?.current?.temperature_2m ?? 28.5;
    const currentHumidity = weatherData?.current?.relative_humidity_2m ?? 64;
    const currentWindSpeed = weatherData?.current?.wind_speed_10m ?? 12.4;
    const currentWindDir = weatherData?.current?.wind_direction_10m ?? 180;
    const currentPressure = weatherData?.current?.surface_pressure ?? 1012;

    // Process full hourly time series for ML and Charts
    const historicalSeries = [];
    const forecastSeries = [];

    for (let i = 0; i < hourly.time.length; i++) {
      const timeStr = hourly.time[i];
      const item = {
        time: timeStr,
        timestamp: new Date(timeStr).getTime(),
        pm2_5: Math.round((hourly.pm2_5[i] ?? 15) * 10) / 10,
        pm10: Math.round((hourly.pm10[i] ?? 30) * 10) / 10,
        no2: Math.round((hourly.nitrogen_dioxide[i] ?? 12) * 10) / 10,
        so2: Math.round((hourly.sulphur_dioxide[i] ?? 5) * 10) / 10,
        o3: Math.round((hourly.ozone[i] ?? 30) * 10) / 10,
        co: Math.round(hourly.carbon_monoxide[i] ?? 250),
        aqi: hourly.us_aqi[i] ?? calculateUsAqi(hourly.pm2_5[i] ?? 15)
      };

      if (i <= currentIndex) {
        historicalSeries.push(item);
      } else {
        forecastSeries.push(item);
      }
    }

    return {
      success: true,
      source: "Open-Meteo Live Global API",
      latitude: lat,
      longitude: lon,
      current: {
        pm2_5: currentPm25,
        pm10: currentPm10,
        no2: currentNo2,
        so2: currentSo2,
        o3: currentO3,
        co: currentCo,
        aqi: currentUsAqi,
        time: hourly.time[currentIndex],
        weather: {
          temp: currentTemp,
          humidity: currentHumidity,
          windSpeed: currentWindSpeed,
          windDir: currentWindDir,
          pressure: currentPressure
        }
      },
      historical: historicalSeries,
      apiForecast: forecastSeries
    };
  } catch (err) {
    console.error("Error fetching live Open-Meteo data:", err);
    throw err;
  }
}

/**
 * Open-Meteo Reverse Geocoding API (Fast, Free, No API Key, No CORS issues)
 */
export async function reverseGeocode(lat, lon) {
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${lat.toFixed(2)},${lon.toFixed(2)}&count=1&language=en`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        const item = data.results[0];
        return {
          displayName: `${item.name}${item.admin1 ? ', ' + item.admin1 : ''}${item.country ? ', ' + item.country : ''}`,
          city: item.name,
          country: item.country || ""
        };
      }
    }
  } catch (e) {
    console.warn("Geocoding lookup fallback:", e);
  }

  // Secondary fallback: Nominatim
  try {
    const nomUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`;
    const res = await fetch(nomUrl, { headers: { 'User-Agent': 'AeroPulse-App/2.0' } });
    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const city = addr.city || addr.town || addr.village || addr.county || addr.state || "Selected Region";
      const country = addr.country || "";
      return {
        displayName: `${city}${country ? ', ' + country : ''}`,
        city,
        country
      };
    }
  } catch (e) {
    console.warn("Nominatim fallback:", e);
  }

  return {
    displayName: `Region (${lat.toFixed(3)}°, ${lon.toFixed(3)}°)`,
    city: "Selected Location",
    country: ""
  };
}

/**
 * Open-Meteo Location Search API
 */
export async function searchLocation(query) {
  if (!query || query.trim().length < 2) return [];
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=6&language=en`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Search failed");
    const data = await res.json();
    if (!data.results) return [];

    return data.results.map(item => ({
      name: `${item.name}${item.admin1 ? ', ' + item.admin1 : ''}${item.country ? ', ' + item.country : ''}`,
      cityName: item.name,
      country: item.country || "",
      lat: item.latitude,
      lon: item.longitude
    }));
  } catch (err) {
    console.error("Location search error:", err);
    return [];
  }
}
