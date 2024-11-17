// ResultsPage.jsx
import React, { useEffect, useState } from 'react';

const POI = () => {
  const [results, setResults] = useState(null);

  useEffect(() => {
    const placesResults = localStorage.getItem('placesResults');
    if (placesResults) {
      setResults(JSON.parse(placesResults));
    }
  }, []);

  if (!results) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No results found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4">
      <h2 className="text-lg font-medium mb-4">Search Results</h2>
      <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
        {JSON.stringify(results, null, 2)}
      </pre>
    </div>
  );
};

export default POI;