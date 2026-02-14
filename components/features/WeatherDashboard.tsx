'use client';

import { useState, useMemo } from 'react';
import { Search, CloudRain, Wind, Droplets, Thermometer, AlertTriangle } from 'lucide-react';
import { generateWeatherData } from '@/lib/dummyData';

export default function WeatherDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const weatherData = useMemo(() => generateWeatherData(), []);

  const filteredWeather = useMemo(() => {
    return weatherData.filter((weather) =>
      weather.county.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [weatherData, searchQuery]);

  const getConditionIcon = (condition: string) => {
    if (condition.includes('Rain')) return '🌧️';
    if (condition.includes('Cloud')) return '☁️';
    if (condition.includes('Sunny') || condition.includes('Clear')) return '☀️';
    return '🌤️';
  };

  const getConditionColor = (condition: string) => {
    if (condition.includes('Rain')) return 'bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-400';
    if (condition.includes('Sunny') || condition.includes('Clear')) return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-700 dark:text-yellow-400';
    return 'bg-gray-500/10 border-gray-500/20 text-gray-700 dark:text-gray-400';
  };

  const rainAlerts = weatherData.filter((w) => w.rainfall > 10 || w.forecast.includes('Rain'));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold font-display mb-2">Weather Forecast</h2>
        <p className="text-muted-foreground">Localized weather data and farming advisories for all 47 counties</p>
      </div>

      {/* Rain Alerts */}
      {rainAlerts.length > 0 && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-1">
                Rain Alerts - {rainAlerts.length} Counties
              </h3>
              <p className="text-sm text-blue-800 dark:text-blue-300">
                {rainAlerts.slice(0, 5).map((w) => w.county).join(', ')}
                {rainAlerts.length > 5 && ` and ${rainAlerts.length - 5} more`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search counties..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-mavuno-500"
        />
      </div>

      {/* Weather Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWeather.map((weather) => (
          <div
            key={weather.county}
            className="bg-card border border-border rounded-xl p-5 hover:shadow-lg transition-shadow"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg">{weather.county}</h3>
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border mt-1 ${getConditionColor(weather.condition)}`}>
                  <span>{getConditionIcon(weather.condition)}</span>
                  <span>{weather.condition}</span>
                </div>
              </div>
              <div className="text-3xl font-bold">{weather.temperature}°C</div>
            </div>

            {/* Weather Stats */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center">
                <Droplets className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                <div className="text-xs text-muted-foreground">Humidity</div>
                <div className="font-semibold">{weather.humidity}%</div>
              </div>
              <div className="text-center">
                <CloudRain className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                <div className="text-xs text-muted-foreground">Rainfall</div>
                <div className="font-semibold">{weather.rainfall}mm</div>
              </div>
              <div className="text-center">
                <Wind className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                <div className="text-xs text-muted-foreground">Wind</div>
                <div className="font-semibold">{weather.windSpeed}km/h</div>
              </div>
            </div>

            {/* Forecast */}
            <div className="bg-muted/50 rounded-lg p-3 mb-3">
              <div className="text-xs font-medium text-muted-foreground mb-1">3-Day Forecast</div>
              <div className="text-sm">{weather.forecast}</div>
            </div>

            {/* Advisory */}
            <div className="bg-mavuno-500/10 border border-mavuno-500/20 rounded-lg p-3">
              <div className="text-xs font-medium text-mavuno-700 dark:text-mavuno-400 mb-1">
                Farming Advisory
              </div>
              <div className="text-sm text-mavuno-900 dark:text-mavuno-200">{weather.advisory}</div>
            </div>
          </div>
        ))}
      </div>

      {filteredWeather.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No counties found matching "{searchQuery}"</p>
        </div>
      )}
    </div>
  );
}
