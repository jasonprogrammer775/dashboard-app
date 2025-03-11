"use client";
import React from 'react';
import { useEffect, useState } from 'react';

interface CryptoFeed {
  name: string;
  symbol: string;
  price: number;
  sentiment: number;
  social_score: number;
}

export default function CryptoSentiment() {
  const [data, setData] = useState<CryptoFeed[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/crypto-sentiment')
      .then(res => res.json())
      .then(data => {
        setData(data.data || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch crypto sentiment data');
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
        <h2 className="text-xl font-bold mb-4">Crypto Sentiment</h2>
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white/10 p-6 rounded-lg shadow-lg backdrop-blur-lg">
      <h2 className="text-xl font-bold mb-4">Crypto Sentiment</h2>
      <div className="space-y-4">
        {data.slice(0, 5).map((coin, index) => (
          <div key={index} className="flex justify-between items-center">
            <div>
              <span className="font-semibold">{coin.symbol}</span>
              <span className="text-sm text-gray-400 ml-2">{coin.name}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`text-sm ${coin.sentiment > 0 ? 'text-green-400' : 'text-red-400'}`}>
                Sentiment: {coin.sentiment.toFixed(2)}
              </span>
              <span className="text-sm text-gray-400">
                Score: {coin.social_score}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}