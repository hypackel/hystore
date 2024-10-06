import React, { useState, useEffect } from 'react';
import { FlatList, Text, View, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const defaultUrls = [
  'https://quarksources.github.io/dist/quantumsource.min.json',
  'https://corsproxy.io/?https%3A%2F%2Fipa.cypwn.xyz%2Fcypwn.json'
];

export default function App() {
  const [appsData, setAppsData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      // Fetch custom URLs from AsyncStorage
      const customReposJson = await AsyncStorage.getItem('customRepos');
      const customRepos = JSON.parse(customReposJson) || [];

      // Combine custom and default URLs
      const urls = [...customRepos, ...defaultUrls];

      // Fetch data from combined URLs
      const fetchedData = await Promise.all(
        urls.map(async (url) => {
          const response = await fetch(url);
          return await response.json();
        })
      );

      const combinedApps = fetchedData.flatMap((source, index) => {
        return source.apps.map(app => ({
          ...app,
          sourceName: source.name,
          sourceUrl: urls[index],
        }));
      });

      setAppsData(combinedApps);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderAppItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={{ flex: 1, marginHorizontal: 8, marginBottom: 16, backgroundColor: 'white', borderRadius: 8, overflow: 'hidden', elevation: 2 }}
      >
        <View style={{ flexDirection: 'row', padding: 16, alignItems: 'flex-start' }}>
          <Image source={{ uri: item.iconURL }} style={{ borderRadius: 8, width: 64, height: 64, marginRight: 16 }} />
          
          <View style={{ flex: 1 }}>
            <Text style={{ color: 'black', fontWeight: 'bold' }}>{item.name}</Text>
            <Text style={{ color: 'gray' }}>Source: {item.sourceName}</Text>
            <Text 
              style={{ color: '#4A4A4A' }} 
              numberOfLines={2}
            >
              {item.localizedDescription}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FF4A4A' }}>
      <View style={{ padding: 16 }}>
        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 24, marginBottom: 16 }}>Fetched Apps</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#ffffff" />
      ) : (
        <FlatList
          data={appsData}
          renderItem={renderAppItem}
          keyExtractor={(item, index) => `${item.bundleIdentifier}-${index}`}
          contentContainerStyle={{ paddingHorizontal: 8 }}
          numColumns={1}
        />
      )}

      <StatusBar style="auto" />
    </View>
  );
}
