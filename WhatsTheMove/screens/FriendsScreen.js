import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import axios from 'axios';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const BASE_URL = 'https://us-central1-hackutd24-whatsthemove.cloudfunctions.net/api'; // Define the base URL  

const FriendsScreen = () => {
  const [friends, setFriends] = useState([{ id: 1, location: null }]);
  const [locations, setLocations] = useState([]); // To store coordinates of locations

  // Add a new friend
  const addFriend = () => {
    setFriends([...friends, { id: friends.length + 1, location: null }]);
  };

  // Update friend's location
  const updateLocation = (id, locationData) => {
    setFriends(friends.map(friend =>
      friend.id === id ? { ...friend, location: locationData } : friend
    ));
  };

  // Handle Continue button, log locations to the console (or send them to your API)
  const handleContinue = async () => {
    const locationsArray = friends.map(friend => friend.location).filter(location => location !== null);
    console.log('Locations:', locationsArray);
    
    try {
      const response = await axios.get(`${BASE_URL}/greeting`);
      console.log('API Response:', response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* You input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>You</Text>
          <View style={styles.inputWrapper}>
            <TextInput style={styles.input} placeholder="Your Location" />
          </View>
        </View>

        {/* Friend inputs */}
        {friends.map((friend) => (
          <View key={friend.id} style={styles.inputContainer}>
            <Text style={styles.label}>Friend {friend.id}</Text>
            <View style={styles.inputWrapper}>
              {/* <TextInput
                style={styles.input}
                placeholder={`Friend ${friend.id} Location`}
              /> */}
              <TouchableOpacity style={styles.deleteButton}>
                <Feather name="trash-2" size={20} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Google Places Input for each friend */}
            <GooglePlacesAutocomplete
              placeholder="Search Location"
              onPress={(data, details = null) => {
                // Update location for the specific friend
                updateLocation(friend.id, {
                  name: data.description,
                  lat: details.geometry.location.lat,
                  lng: details.geometry.location.lng,
                });
                console.log('Selected place:', data);
                console.log('Location Details:', details);
              }}
              query={{
                key: 'AIzaSyCJSALgtJFlCsqxa-2oNImKXy3Zq6X9UIM', // Replace with your Google API Key
                language: 'en',
              }}
              fetchDetails={true}
              onFail={error => console.error(error)}
              styles={{
                container: {
                  width: '100%',
                  zIndex: 10,
                },
                textInput: {
                  height: 50,
                  borderColor: '#ddd',
                  borderWidth: 1,
                  borderRadius: 8,
                  paddingHorizontal: 15,
                  fontSize: 16,
                  backgroundColor: '#fff',
                },
                listView: {
                  backgroundColor: 'white',
                  zIndex: 20,
                },
              }}
            />
          </View>
        ))}

        <TouchableOpacity style={styles.addButton} onPress={addFriend}>
          <Text style={styles.addButtonText}>Add People</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  deleteButton: {
    padding: 10,
    marginLeft: 10,
  },
  addButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  continueButton: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FriendsScreen;



