import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const COMMON_SUGGESTIONS = [
  "restaurant", "cafe", "coffee shop", "fast food", "pizza", "sushi", "bakery", "ice cream shop", "food court", "deli", "grocery store", "supermarket", "convenience store", "farmers market", "mall", "shopping center", "retail park", "outlet mall", "department store", "clothing store", "electronics store", "bookstore", "pharmacy", "gym", "fitness center", "yoga studio", "sports complex", "swimming pool", "park", "playground", "basketball court", "tennis court", "golf course", "movie theater", "concert hall", "museum", "art gallery", "library", "community center", "hotel", "motel", "bed and breakfast", "hospital", "urgent care", "medical clinic", "dentist", "veterinarian", "school", "university", "college", "daycare", "bank", "atm", "post office", "gas station", "car wash", "auto repair", "parking garage", "train station", "bus stop", "airport", "subway station", "taxi stand", "bike rental", "hair salon", "spa", "nail salon", "barber shop", "laundromat", "dry cleaner", "pet store", "hardware store", "furniture store", "office supply", "phone store", "bar", "pub", "nightclub", "brewery", "wine shop", "church", "temple", "mosque", "synagogue", "police station", "fire station", "city hall", "courthouse", "public restroom", "tourist information", "visitor center", "beach", "hiking trail", "campground", "zoo", "aquarium", "amusement park", "bowling alley", "arcade", "storage facility", "moving company", "car rental", "bike shop", "flower shop", "jewelry store", "optometrist", "shoe store", "thai restaurant", "mexican restaurant", "italian restaurant", "chinese restaurant", "indian restaurant", "steakhouse", "seafood restaurant", "vegan restaurant", "vegetarian cafe", "bubble tea shop", "smoothie bar", "juice bar", "bagel shop", "donut shop", "sandwich shop", "food truck", "bbq restaurant", "mediterranean restaurant", "korean bbq", "ramen shop", "pho restaurant", "dim sum restaurant", "taco shop", "burger joint", "wings restaurant", "sports bar", "irish pub", "cocktail bar", "wine bar", "karaoke bar", "dance club", "live music venue", "jazz club", "comedy club", "art house cinema", "imax theater", "performing arts center", "theater", "opera house", "ballet studio", "dance studio", "martial arts dojo", "crossfit gym", "pilates studio", "spin class", "rock climbing gym", "skating rink", "roller rink", "skate park", "mini golf", "driving range", "tennis club", "soccer field", "baseball field", "football stadium", "basketball stadium", "volleyball court", "racquetball court", "squash court", "boxing gym", "recreation center", "aquatic center", "water park", "theme park", "children's museum", "science museum", "history museum", "botanical garden", "sculpture garden", "public garden", "dog park", "skate park", "bike trail", "running trail", "nature preserve", "state park", "national park", "wildlife sanctuary", "bird sanctuary", "fishing spot", "marina", "boat rental", "kayak rental", "surf shop", "dive shop", "antique store", "thrift store", "vintage clothing", "comic book store", "game store", "toy store", "hobby shop", "craft store", "art supply store", "music store", "record store", "musical instrument store", "camera store", "sporting goods store", "outdoor gear", "camping store", "bicycle shop", "motorcycle dealer", "car dealership", "tire shop", "auto parts store", "body shop", "mechanic", "oil change", "car detailing", "electric vehicle charging", "bike sharing station", "bus terminal", "ferry terminal", "heliport", "private airport", "international airport", "rental car facility", "moving truck rental", "self storage", "mini storage", "climate controlled storage", "warehouse", "shipping center", "print shop", "copy center", "office space", "coworking space", "conference center", "event venue", "wedding venue", "banquet hall", "cathedral", "meditation center", "spiritual center", "cemetery", "funeral home", "crematorium", "emergency room", "walk-in clinic", "family practice", "pediatrician", "orthodontist", "dermatologist", "chiropractor", "physical therapy", "massage therapy", "acupuncture", "mental health clinic", "counseling center", "rehabilitation center", "nursing home", "assisted living", "retirement community", "senior center", "youth center", "boys and girls club", "ymca", "public pool", "indoor pool", "gym with pool", "tennis lessons", "golf lessons", "driving school", "language school", "music school", "dance school", "cooking school", "trade school", "beauty school", "computer training", "tutoring center", "learning center", "adult education", "vocational school", "art school", "film school", "photography school", "culinary institute", "business school", "law school", "medical school", "dental school", "veterinary school", "pharmacy school", "nursing school", "graduate school", "elementary school", "middle school", "high school", "montessori school", "waldorf school", "private school", "charter school", "international school", "boarding school", "special education", "preschool", "kindergarten"
];

const Midpoint = () => {
  const navigate = useNavigate();
  const [midpoint, setMidpoint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [map, setMap] = useState(null);
  const [service, setService] = useState(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

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

    // Cleanup
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
        setMidpoint(response.data.midpoint);
        
        if (isScriptLoaded) {
          // Initialize map and service after getting midpoint and script is loaded
          const mapDiv = document.createElement('div');
          const newMap = new window.google.maps.Map(mapDiv, {
            center: { lat: response.data.midpoint.lat, lng: response.data.midpoint.lng },
            zoom: 15
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
  }, [isScriptLoaded]); // Add isScriptLoaded as a dependency

  const handleSearch = () => {
    if (!searchQuery || !midpoint || !isScriptLoaded) return;
    setShowSuggestions(false);
  
    try {
      const mapDiv = document.createElement('div');
      const map = new window.google.maps.Map(mapDiv, {
        center: { lat: midpoint.lat, lng: midpoint.lng },
        zoom: 15
      });
  
      const service = new window.google.maps.places.PlacesService(map);
  
      const request = {
        query: searchQuery,
        location: new window.google.maps.LatLng(midpoint.lat, midpoint.lng),
        radius: 2000 // 2km radius
      };
  
      service.textSearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {

          const limitedResults = results.slice(0, 7);
          localStorage.setItem('placesResults', JSON.stringify(limitedResults));
          navigate('/poi');
        } else {
          console.error('Error searching places:', status);
        }
      });
    } catch (error) {
      console.error('Error in handleSearch:', error);
    }
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

  const filteredSuggestions = COMMON_SUGGESTIONS.filter(suggestion =>
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
    <div className="min-h-screen bg-white flex flex-col p-4">
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Choose Point of Interest:
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={handleInputChange}
              className="flex-1 p-2 border-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <button
          onClick={handleSearch}
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

