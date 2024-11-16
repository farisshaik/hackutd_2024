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

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* You input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>You</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder=""
            />
          </View>
        </View>

        {/* Friend inputs */}
        {[1, 2, 3].map((num) => (
          <View key={num} style={styles.inputContainer}>
            <Text style={styles.label}>Friend {num}</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder=""
              />
              <TouchableOpacity
                style={styles.deleteButton}
              >
                <Feather name="trash-2" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => console.log('Add people pressed')}
        >
          <Text style={styles.addButtonText}>Add People</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => console.log('Continue pressed')}
        >
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
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
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#333',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#444',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: '#666',
  },
  activeNavText: {
    color: '#4A90E2',
  },
});

export default App;