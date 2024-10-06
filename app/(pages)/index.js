import React, { useState, useEffect } from 'react';
import { FlatList, Text, View, ActivityIndicator, Image, TouchableOpacity, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const defaultUrls = [
  'https://quarksources.github.io/dist/quantumsource.min.json',
  'https://corsproxy.io/?https%3A%2F%2Fipa.cypwn.xyz%2Fcypwn.json'
];

export default function App() {
  const [appsData, setAppsData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); 
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = async (repos) => {
    setLoading(true);
    try {
      const urls = [...repos, ...defaultUrls];
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
      setFilteredData(combinedApps);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false); 
    }
  };

  const loadCustomRepos = async () => {
    const customReposJson = await AsyncStorage.getItem('customRepos');
    return JSON.parse(customReposJson) || [];
  };

  useEffect(() => {
    const loadData = async () => {
      const repos = await loadCustomRepos();
      fetchData(repos);
    };
    loadData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    const repos = await loadCustomRepos();
    fetchData(repos); 
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const filtered = appsData.filter(app => 
        app.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(appsData); 
    }
  };

  const renderAppItem = ({ item }) => {
    const index = appsData.findIndex(app => app.bundleIdentifier === item.bundleIdentifier);
  
    return (
      <TouchableOpacity
        style={{
          flex: 1,
          marginHorizontal: 8,
          marginBottom: 16,
          backgroundColor: '#242424', // Darker background for cards
          borderRadius: 12,
          overflow: 'hidden',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.8,
          shadowRadius: 5,
          elevation: 4, // Card shadow for depth
        }}
        onPress={() => router.push(`/detail/${item.bundleIdentifier}?source=${encodeURIComponent(item.sourceUrl)}`)}
      >
        <View style={{ flexDirection: 'row', padding: 16, alignItems: 'center' }}>
          <Image source={{ uri: item.iconURL }} style={{ borderRadius: 8, width: 64, height: 64, marginRight: 16 }} />
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 18 }}>{item.name}</Text>
            <Text style={{ color: '#CCC', marginTop: 4 }}>Source: {item.sourceName}</Text>
            <Text style={{ color: '#888', marginTop: 4 }} numberOfLines={2}>
              {item.localizedDescription}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#121212' }}> 
      <View style={{ padding: 16, backgroundColor: '#1F1F1F' }}> 
        <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 24, marginBottom: 16 }}>Fetched Apps</Text>
        <TextInput
          placeholder="Search apps..."
          placeholderTextColor="#888" 
          value={searchQuery}
          onChangeText={handleSearch}
          style={{
            height: 40,
            borderColor: '#444',
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: 10,
            color: '#FFF',
            backgroundColor: '#2C2C2C',
            marginBottom: 16
          }}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#ffffff" />
      ) : (
        <FlatList
          data={filteredData}
          renderItem={renderAppItem}
          keyExtractor={(item, index) => `${item.bundleIdentifier}-${index}`}
          contentContainerStyle={{ paddingHorizontal: 8 }}
          numColumns={1}
          refreshing={refreshing} 
          onRefresh={onRefresh} 
        />
      )}

      <StatusBar style="light" />
    </View>
  );
}
