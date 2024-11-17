import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Pressable
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import axios from 'axios';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import 'react-native-get-random-values';
import { GOOGLE_API_KEY } from '@env'; 

const BASE_URL = 'https://us-central1-hackutd24-whatsthemove.cloudfunctions.net/api'; // Define the base URL  

const App = () => {
  const handleContinue = async () => {
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
            <TextInput style={styles.input} placeholder="" />
          </View>
        </View>

        {/* Friend inputs */}
        {[1, 2, 3].map((num) => (
          <View key={num} style={styles.inputContainer}>
            <Text style={styles.label}>Friend {num}</Text>
            <View style={styles.inputWrapper}>
              <TextInput style={styles.input} placeholder="" />
              <TouchableOpacity style={styles.deleteButton}>
                <Feather name="trash-2" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Google Places Autocomplete */}
        <GooglePlacesAutocomplete
          placeholder="Search"
          onPress={(data, details = null) => {
            console.log(data, details);
          }}
          query={{
            key: GOOGLE_API_KEY, // Replace with your Google API Key
            language: 'en',
          }}
        />

        <TouchableOpacity style={styles.addButton} onPress={() => console.log('Add people pressed')}>
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

export default App;

