// index.tsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet,  Image, useColorScheme, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Searchbar, Text, Appbar, Dialog,  Card, Avatar} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const [inputValue, setInputValue] = useState('');
  const [visible, setVisible] = React.useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  const router = useRouter();
  const hideDialog = () => setVisible(false);

  const loadFavorites = async () => {
      try {
          const favouritesStr = await AsyncStorage.getItem('favourites');
          if (favouritesStr) {
              const parsedFavourites = JSON.parse(favouritesStr);
              setFavorites(parsedFavourites);
          }
      } catch (error) {
          console.error('Error loading favorites:', error);
      }
  };

  const handleSearch = () => {
    if (!inputValue) {
      setVisible(true);
      return;
    }
    router.push({ pathname: '/UserScreen', params: { input: inputValue } });
  }

  useEffect(() => {
    loadFavorites();
  }, []);

  return (
    <View style={styles.main}>
      <Appbar.Header>
        <Appbar.Content title="Swifty Companion" />
      </Appbar.Header>
      <View style={styles.container}>
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
        <Card style={{ marginTop: 20, padding: 16, elevation: 4 }}>
        <Card.Title
          title="Favorites"
          subtitle="List of all your favorite users"
          left={(props) => <Avatar.Icon {...props} icon="star" />}
        />
        <ScrollView style={{ maxHeight: 200 }}  contentContainerStyle={{ flexGrow: 1 }} nestedScrollEnabled={true}>
          <Card.Content>
            {favorites.length > 0 ? (
              favorites.map((item, index) => (
                <Button
              key={index}
              mode="outlined"
              style={{
                marginVertical: 4,
                borderRadius: 8,
              }}
              icon="account"
              onPress={() => router.push({ pathname: '/UserScreen', params: { input: item } })}
                  >
              {item}
                  </Button>
                ))
              ) : (
              <Text style={{ fontSize: 14, textAlign: 'center', color: '#999', marginTop: 8 }}>
                No favorites yet
              </Text>
            )}
          </Card.Content>
          </ScrollView>
        </Card>
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