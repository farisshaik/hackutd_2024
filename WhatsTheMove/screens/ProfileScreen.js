import React from 'react';
import { Text, View, Image } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Input } from 'react-native-elements';

import { GOOGLE_API_KEY } from 'react-native-dotenv';

const GOOGLE_PLACES_API_KEY = GOOGLE_API_KEY;

const GooglePlacesInput = () => {
  return (
    <GooglePlacesAutocomplete
      query={{
        key: GOOGLE_PLACES_API_KEY,
        language: 'en', // language of the results
      }}
      onPress={(data, details) => console.log(data, details)}
      textInputProps={{
        InputComp: Input,
        leftIcon: { type: 'font-awesome', name: 'chevron-left' },
        errorStyle: { color: 'red' },
      }}
    />
  );
};

export default GooglePlacesInput;