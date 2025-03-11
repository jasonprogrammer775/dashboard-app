"use client";

import { useEffect, useState } from "react";

export default function WakaTimeStats() {
  const [stats, setStats] = useState<{
    total_seconds: number;
    languages: Array<{
      name: string;
      percent: number;
    }>;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/wakatime")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setStats(data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching WakaTime stats:", err);
        setError("Failed to load WakaTime stats");
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="bg-white/10 p-6 rounded-lg shadow-lg backdrop-blur-lg">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300/20 rounded w-1/2 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-300/20 rounded"></div>
            <div className="h-4 bg-gray-300/20 rounded"></div>
            <div className="h-4 bg-gray-300/20 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="bg-white/10 p-6 rounded-lg shadow-lg backdrop-blur-lg">
        <h2 className="text-xl font-bold mb-4">WakaTime Stats</h2>
        <p className="text-red-400">{error}</p>
      </div>
    );

  if (!stats)
    return (
      <div className="bg-white/10 p-6 rounded-lg shadow-lg backdrop-blur-lg">
        <h2 className="text-xl font-bold mb-4">WakaTime Stats</h2>
        <p>No data available</p>
      </div>
    );

  return (
    <div className="bg-white/10 p-6 rounded-lg shadow-lg backdrop-blur-lg">
      <h2 className="text-xl font-bold mb-4">Coding Activity</h2>
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold">Total Coding Time</h3>
          <p className="text-2xl font-bold">
            {Math.round(stats.total_seconds / 3600)} hours
          </p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Top Languages</h3>
          <div className="space-y-2">
            {stats.languages.slice(0, 5).map((lang: { name: string; percent: number }) => (
              <div
                key={lang.name}
                className="flex items-center justify-between"
              >
                <span>{lang.name}</span>
                <span className="font-semibold">
                  {Math.round(lang.percent)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
