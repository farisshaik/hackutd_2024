import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import axios from 'axios';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { useNavigate } from 'react-router-dom';
const BASE_URL = 'AIzaSyBOqjnER7AnSnlMaj_eqjLdjstI4zR91UM';

const FriendsPage = () => {
    
  const navigate = useNavigate();
    
  const [friends, setFriends] = useState([{ id: 1, name: '', location: null }]);
  const [nextId, setNextId] = useState(2);

  const addFriend = () => {
    setFriends([...friends, { id: nextId, name: '', location: null }]);
    setNextId(nextId + 1);
  };

  const removeFriend = (id) => {
    setFriends(friends.filter(friend => friend.id !== id));
    setNextId(nextId - 1);
  };

  const updateFriend = (id, field, value) => {
    setFriends(friends.map(friend => 
      friend.id === id ? { ...friend, [field]: value } : friend
    ));
  };

  const handleContinue = async () => {
    const locationsArray = friends.map(friend => friend.location).filter(location => location !== null);
    
    // Store coordinates in localStorage or state management
    try {
      const coordinates = await Promise.all(
        locationsArray.map(async (location) => {
          const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?place_id=${location.place_id}&key=${BASE_URL}`
          );
          const { lat, lng } = response.data.results[0].geometry.location;
          return [lat, lng];
        })
      );
      
      console.log('Converted coordinates:', coordinates); // Debug log
      localStorage.setItem('coordinates', JSON.stringify(coordinates));
      navigate('/midpoint');
    } catch (error) {
      console.error('Error converting addresses to coordinates:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 overflow-y-auto px-4 py-6 pb-32">
        {/* You input */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">You</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Name"
              className="w-1/3 p-2 border-2 border-gray-300 rounded-md shadow-sm 
                       focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <div className="w-2/3">
              <GooglePlacesAutocomplete
                selectProps={{
                  placeholder: 'Your address',
                  onChange: (value) => {
                    updateFriend(1, 'location', {
                        description: value.label,
                        place_id: value.value.place_id
                      });
                    console.log('Your location:', value);
                  },
                  styles: {
                    control: (provided) => ({
                      ...provided,
                      borderRadius: '0.375rem',
                      borderColor: '#d1d5db',
                      height: '42px'
                    })
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Friend inputs */}
        {friends.map((friend, index) => (
          <div key={friend.id} className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Friend {friend.id}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Name"
                value={friend.name}
                onChange={(e) => updateFriend(friend.id, 'name', e.target.value)}
                className="w-1/3 p-2 border-2 border-gray-300 rounded-md shadow-sm 
                         focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <div className="w-2/3">
                <GooglePlacesAutocomplete
                  selectProps={{
                    placeholder: 'Friend address',
                    onChange: (value) => {
                      updateFriend(friend.id, 'location', {
                        description: value.label,
                        place_id: value.value.place_id
                      });
                    },
                    styles: {
                      control: (provided) => ({
                        ...provided,
                        borderRadius: '0.375rem',
                        borderColor: '#d1d5db',
                        height: '42px'
                      })
                    }
                  }}
                />
              </div>
              {index > 0 && (
                <button
                  onClick={() => removeFriend(friend.id)}
                  className="flex-shrink-0 h-10 w-10 flex items-center justify-center 
                           border-2 border-gray-300 rounded-md
                           hover:bg-gray-100 transition-colors duration-200"
                  aria-label="Remove friend"
                >
                  <Trash2 className="w-4 h-4 text-gray-500" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Fixed bottom section */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 space-y-3">
        <button
            onClick={addFriend}
            className="w-full bg-black text-white py-2 rounded-md 
                    hover:bg-gray-800 transition-colors duration-200
                    text-sm font-medium"
        >
            Add People
        </button>
        <button 
            onClick={handleContinue}
            className="w-full bg-blue-500 text-white py-2 rounded-md 
                    hover:bg-blue-600 transition-colors duration-200
                    text-sm md:text-base
                    focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        >
            Continue
        </button>
        </div>
    </div>
  );
};

export default FriendsPage;