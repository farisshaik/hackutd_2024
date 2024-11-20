import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const COMMON_SUGGESTIONS = [
  "halal food", "restaurant", "cafe", "coffee shop", "fast food", "pizza", "sushi", "bakery", "ice cream shop", "food court",
  "park", "gym", "movie theater", "museum", "hotel", "zoo", "beach", "campground", "shopping center", "bookstore",
  "bubble tea shop", "donut shop", "ramen shop", "karaoke bar", "live music venue", "art gallery", "community center"
];

const Midpoint = () => {
  const navigate = useNavigate();
  const [midpoint, setMidpoint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  // eslint-disable-next-line
  const [map, setMap] = useState(null);
  const [service, setService] = useState(null);

  // Load Google Maps script
  useEffect(() => {
    const loadGoogleMapsScript = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.addEventListener('load', () => setIsScriptLoaded(true));
      document.head.appendChild(script);
    };

    loadGoogleMapsScript();

    // Cleanup script from the DOM
    return () => {
      const script = document.querySelector(`script[src*="maps.googleapis.com/maps/api/js"]`);
      if (script) {
        document.head.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    const calculateMidpoint = async () => {
      try {
        const coordinates = JSON.parse(localStorage.getItem('coordinates'));
        const response = await axios.post(
          'https://us-central1-hackutd24-whatsthemove.cloudfunctions.net/api/calculate-midpoint',
          { coordinates }
        );

        const midpointData = response.data.midpoint;
        setMidpoint(midpointData);
        localStorage.setItem('midpoint', JSON.stringify(midpointData));

        if (isScriptLoaded) {
          // Initialize Google Maps and PlacesService
          const mapDiv = document.createElement('div');
          const newMap = new window.google.maps.Map(mapDiv, {
            center: { lat: midpointData.lat, lng: midpointData.lng },
            zoom: 15,
          });
          setMap(newMap);
          setService(new window.google.maps.places.PlacesService(newMap));
        }

        setLoading(false);
      } catch (error) {
        console.error('Error calculating midpoint:', error);
        setLoading(false);
      }
    };

    if (isScriptLoaded) {
      calculateMidpoint();
    }
  }, [isScriptLoaded]);

  const handleSearch = () => {
    if (!searchQuery || !midpoint || !isScriptLoaded) return;
    setShowSuggestions(false);

    const request = {
      query: searchQuery,
      location: new window.google.maps.LatLng(midpoint.lat, midpoint.lng),
      radius: 2000, // 2km radius
    };

    service.textSearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
        const processedResults = results.slice(0, 10).map((place) => ({
          ...place,
          geometry: {
            ...place.geometry,
            location: {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            },
          },
          photos: place.photos ? place.photos.map((photo) => ({ url: photo.getUrl() })) : [],
        }));
        localStorage.setItem('placesResults', JSON.stringify(processedResults));
        navigate('/poi');
      } else {
        console.error('Error searching places:', status);
      }
    });
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setShowSuggestions(false);
  };

  const filteredSuggestions = COMMON_SUGGESTIONS.filter((suggestion) =>
    suggestion.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    <div className="items-center min-h-screen bg-white flex flex-col p-4">
      <header className="text-center mt-8 w-full md:w-2/3">
        <h1 className="text-4xl font-semibold tracking-wide text-blue-600">What to do?</h1>
        <h2 className="text-2xl font-normal text-gray-500">
        Start typing to search for a type of location, like ‘restaurant,’ ‘park,’ or ‘coffee shop.’
        <br></br> We’ll suggest options as you type to help you find the perfect spot to meet
        </h2>
      </header>
      <div className="flex-1 overflow-y-auto px-4 py-6 pb-32 w-full md:w-2/3 mx-auto">
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={handleInputChange}
              className="w-full p-2 border-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Search for places..."
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="flex-shrink-0 h-10 w-10 flex items-center justify-center border-2 border-gray-300 rounded-md hover:bg-gray-100 transition-colors duration-200"
                aria-label="Clear search"
              >
                <Trash2 className="w-4 h-4 text-gray-500" />
              </button>
            )}
          </div>
        </div>

        {showSuggestions && searchQuery && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Suggestions</h3>
            <div className="space-y-2">
              {filteredSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="p-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
                >
                  {suggestion}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <div className="w-full md:w-1/3 mx-auto space-y-3">
            <button
              onClick={handleSearch}
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors duration-200 text-sm font-medium"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Midpoint;