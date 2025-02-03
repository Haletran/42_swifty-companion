// index.tsx
import React, { useState } from 'react';
import { View, StyleSheet,  Image, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Searchbar, Text, Appbar, Dialog, adaptNavigationTheme } from 'react-native-paper';


export default function HomeScreen() {
  const [inputValue, setInputValue] = useState('');
  const [visible, setVisible] = React.useState(false);

  const router = useRouter();
  const hideDialog = () => setVisible(false);

  const handleSearch = () => {
    if (!inputValue) {
      setVisible(true);
      return;
    }
    router.push({ pathname: '/UserScreen', params: { input: inputValue } });
  }
  return (
    <View style={styles.main}>
      <Appbar.Header>
        <Appbar.Content title="Swifty Companion" />
      </Appbar.Header>
      <View style={styles.container}>
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <Image 
            source={{ uri: 'https://duckduckgo.com/i/00f2c42d3c06d4bd.png' }} 
            style={{ width: 200, height: 200, resizeMode: 'contain' }}
          />
        </View>
        <Searchbar
          placeholder="Search"
          onChangeText={(text: any) => setInputValue(text)}
          value={inputValue}
          onSubmitEditing={handleSearch}
        />        
        <Text style={[styles.textInfo, { color: '#666', fontSize: 14 }]}>
          ⚠️ API Rate Limit: Maximum 1200 searches per hour
        </Text>
        {visible && (
            <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Icon icon="alert" size={40} color="#ff9800" />
            <Dialog.Title style={{textAlign: 'center', color: '#333'}}>Invalid Search</Dialog.Title>
            <Dialog.Content>
              <Text style={{textAlign: 'center', fontSize: 14, color: '#666'}}>
              Search field cannot be empty
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button 
              onPress={hideDialog}
              >
              OK
              </Button>
            </Dialog.Actions>
            </Dialog>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  main: {
    flex: 1,
    backgroundColor: 'white',
  },
  textInfo: {
    textAlign: 'center',
    marginTop: 12,
  },
});