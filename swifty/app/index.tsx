// index.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const [inputValue, setInputValue] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    if (!inputValue) {
      return;
    }
    router.push({ pathname: '/UserScreen', params: { input: inputValue } });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Login:</Text>
      <TextInput
        placeholder="Enter the login..."
        placeholderTextColor="grey"
        style={styles.input}
        onChangeText={text => setInputValue(text)}
        value={inputValue}
      />
      <Button
        title="Search"
        onPress={handleSearch}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', // Center horizontally
    padding: 16,
  },
  input: {
    height: 40,
    width: '20%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
  }
});