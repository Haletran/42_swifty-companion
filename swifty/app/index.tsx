// index.tsx
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Searchbar } from 'react-native-paper';

export default function HomeScreen() {
  const [inputValue, setInputValue] = useState('');
  const [searches, setSearches] = useState(0);
  const router = useRouter();

  const handleSearch = () => {
    if (!inputValue) {
      return;
    }
    setSearches(searches + 1);
    router.push({ pathname: '/UserScreen', params: { input: inputValue } });
  }

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search"
        onChangeText={(text: any) => setInputValue(text)}
        value={inputValue}
        onSubmitEditing={handleSearch}
      />
      <Text style={styles.textInfo}>⚠️ Only 1200 searches allowed per hour</Text>
      <Text style={styles.textInfo}>🔍 Searches: {searches}/1200</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  textInfo: {
    textAlign: 'center',
    marginTop: 12,
  },
});