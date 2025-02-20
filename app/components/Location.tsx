"use client";
import useGeolocation from '../hooks/useGeolocation';

const Location = () => {
  const { location, error } = useGeolocation();

  return (
    <div className="bg-white/10 p-4 rounded-lg shadow-lg backdrop-blur-lg">
      <h3 className="text-xl font-semibold">Your Location</h3>
      {error ? (
        <p className="text-red-500 mt-2">{error}</p>
      ) : (
        <div className="mt-4">
          <p className="text-gray-300">Latitude: {location.lat || 'Loading...'}</p>
          <p className="text-gray-300">Longitude: {location.lon || 'Loading...'}</p>
        </div>
      )}
    </div>
  );
};

export default Location;
