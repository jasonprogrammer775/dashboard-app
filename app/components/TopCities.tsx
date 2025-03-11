"use client";
import { useEffect, useState } from 'react';

interface City {
  city: string;
  country: string;
  population: number;
  latitude: number;
  longitude: number;
}

export default function TopCities() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/cities')
      .then(res => res.json())
      .then(data => {
        setCities(data.data || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch cities data');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="bg-white/10 p-6 rounded-lg shadow-lg backdrop-blur-lg">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-300/20 rounded w-1/2"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-300/20 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/10 p-6 rounded-lg shadow-lg backdrop-blur-lg">
        <h2 className="text-xl font-bold mb-4">Top Global Cities</h2>
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white/10 p-6 rounded-lg shadow-lg backdrop-blur-lg">
      <h2 className="text-xl font-bold mb-4">Top Global Cities</h2>
      <div className="space-y-4">
        {cities.map((city, index) => (
          <div key={index} className="flex justify-between items-center">
            <div>
              <span className="font-semibold">{city.city}</span>
              <span className="text-sm text-gray-400 ml-2">{city.country}</span>
            </div>
            <div className="text-right">
              <span className="text-sm text-gray-300">
                {city.population.toLocaleString()} people
              </span>
              <div className="text-xs text-gray-400">
                {city.latitude.toFixed(2)}°N, {city.longitude.toFixed(2)}°E
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}