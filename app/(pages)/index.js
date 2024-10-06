import React, { useState, useEffect } from 'react';
import { FlatList, Text, View, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const urls = [
  'https://quarksources.github.io/dist/quantumsource.min.json',
  'https://corsproxy.io/?https%3A%2F%2Fipa.cypwn.xyz%2Fcypwn.json'
];

export default function App() {
  const [appsData, setAppsData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
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
          sourceUrl: urls[index]
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
      className="mb-4 bg-white rounded-lg shadow-lg overflow-hidden"
      style={{ flex: 1, marginHorizontal: 8 }}
    >
      <View className="flex-row p-4 items-start">
        <Image source={{ uri: item.iconURL }} className="rounded-md w-16 h-16 mr-4" />
        
        <View className="flex-1">
          <Text className="text-black font-bold">{item.name}</Text>
          <Text className="text-gray-500">Source: {item.sourceName}</Text>
          <Text 
            className="text-gray-700" 
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
    <View className="flex-1 bg-red-500">
      <View className="p-4">
        <Text className="text-white font-bold text-xl mb-4">Fetched Apps</Text>
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