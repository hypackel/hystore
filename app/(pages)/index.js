import React, { useState, useEffect } from 'react';
import { FlatList, Text, View, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const urls = [
  'https://quarksources.github.io/dist/quantumsource.min.json',
  'https://ipa.cypwn.xyz/cypwn.json'
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

      const ipaData = fetchedData[1];
      if (ipaData.apps) {
        setAppsData(ipaData.apps);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderAppItem = ({ item }) => (
    <TouchableOpacity 
      className="mb-4 bg-white rounded-lg shadow-lg overflow-hidden"
      style={{ flex: 1, marginHorizontal: 8 }} // Add horizontal margin
    >
      <View className="p-4">
        <Image source={{ uri: item.iconURL }} className="w-16 h-16 mb-2" />
        <Text className="text-black font-bold">{item.name}</Text>
        <Text className="text-gray-700">{item.localizedDescription}</Text>
        <Text className="text-gray-500">Version: {item.version}</Text>
        <Text className="text-gray-500">Size: {(item.size / 1024 / 1024).toFixed(2)} MB</Text>
      </View>
    </TouchableOpacity>
  );

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
          contentContainerStyle={{ paddingHorizontal: 8 }} // Add horizontal padding to the list
          numColumns={1}
        />
      )}

      <StatusBar style="auto" />
    </View>
  );
}