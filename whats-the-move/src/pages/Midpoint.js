// ResultsPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Midpoint = () => {
  const [midpoint, setMidpoint] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const calculateMidpoint = async () => {
      try {
        // Get coordinates from localStorage
        const coordinates = JSON.parse(localStorage.getItem('coordinates'));
        console.log('Retrieved coordinates from localStorage:', coordinates);

        // Call your Firebase function
        const response = await axios.post(
          'https://us-central1-hackutd24-whatsthemove.cloudfunctions.net/api/calculate-midpoint',
          { coordinates }
        );

        console.log('API Response:', response.data);
        console.log('Calculated midpoint:', response.data.midpoint);

        setMidpoint(response.data.midpoint);
        setLoading(false);
      } catch (error) {
        console.error('Error calculating midpoint:', error);
        setLoading(false);
      }
    };

    calculateMidpoint();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Calculating optimal location...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col p-4">
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-2">Optimal Meeting Point</h2>
        {midpoint && (
          <div className="p-4 border-2 border-gray-300 rounded-md">
            <p className="text-sm text-gray-600">Latitude: {midpoint.lat}</p>
            <p className="text-sm text-gray-600">Longitude: {midpoint.lng}</p>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <button
          onClick={() => {/* Handle navigation to next page */}}
          className="w-full bg-blue-500 text-white py-2 rounded-md 
                   hover:bg-blue-600 transition-colors duration-200
                   text-sm font-medium"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default Midpoint;