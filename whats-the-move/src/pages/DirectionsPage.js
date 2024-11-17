import React, { useState, useEffect } from 'react';

const DirectionsPage = () => {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [directionsUrl, setDirectionsUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const place = JSON.parse(localStorage.getItem('selectedPlace'));
    if (place) {
      setSelectedPlace(place);
      const url = `https://www.google.com/maps/dir/?api=1&destination=${place.geometry.location.lat},${place.geometry.location.lng}`;
      setDirectionsUrl(url);
    }
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(directionsUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col p-4">
      <div className="max-w-2xl mx-auto w-full">
        <h2 className="text-2xl font-bold mb-6">Directions to {selectedPlace?.name}</h2>
        
        <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Google Maps Directions Link</h3>
          
          <div className="relative">
            <input
              type="text"
              value={directionsUrl}
              readOnly
              className="w-full p-3 pr-24 border-2 border-gray-300 rounded-lg bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              onClick={(e) => e.target.select()}
            />
            <button
              onClick={handleCopy}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 
                ${copied ? 'bg-green-500' : 'bg-blue-500'} 
                text-white rounded-md hover:${copied ? 'bg-green-600' : 'bg-blue-600'} 
                transition-colors duration-200`}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          
          <p className="text-sm text-gray-600 mt-2">
            Click the link to select it, or use the copy button
          </p>
        </div>

        <div className="mt-6">
          <button
            onClick={() => window.open(directionsUrl, '_blank')}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors"
          >
            Open in Google Maps
          </button>
        </div>
      </div>
    </div>
  );
};

export default DirectionsPage;