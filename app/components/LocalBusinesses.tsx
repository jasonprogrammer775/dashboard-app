"use client";
import { useEffect, useState } from 'react';

interface Business {
  name: string;
  address: string;
  rating: number;
  type: string; // Changed from categories array
  phone: string; // Changed from phone_number
}

export default function LocalBusinesses() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/businesses')
      .then(res => res.json())
      .then(data => {
        if (data.data && Array.isArray(data.data)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const formattedData = data.data.map((business: any) => ({
            name: business.name || 'Unknown',
            address: business.address || 'No address available',
            rating: business.rating || 0,
            type: business.type || 'Business',
            phone: business.phone || 'No phone available'
          }));
          setBusinesses(formattedData);
        } else {
          setError('Invalid data format');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch business data');
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
        <h2 className="text-xl font-bold mb-4">Local Businesses</h2>
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white/10 p-6 rounded-lg shadow-lg backdrop-blur-lg">
      <h2 className="text-xl font-bold mb-4">Nearby Businesses</h2>
      <div className="space-y-4">
        {businesses.map((business, index) => (
          <div key={index} className="border-b border-gray-600 pb-3 last:border-0">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold">{business.name}</h3>
              <span className="text-yellow-400">★ {business.rating}</span>
            </div>
            <p className="text-sm text-gray-300">{business.address}</p>
            <p className="text-sm text-gray-400">{business.phone}</p>
            <span className="text-xs bg-blue-500/20 px-2 py-1 rounded mt-2 inline-block">
              {business.type}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}