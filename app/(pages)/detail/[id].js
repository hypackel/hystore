import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Button, ActivityIndicator, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

const AppDetail = () => {
  const router = useRouter();
  const { id, source } = useLocalSearchParams();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAppsData = async (sourceUrl) => {
    try {
      const response = await fetch(sourceUrl);
      const data = await response.json();
      return data.apps.map(app => ({
        ...app,
        sourceName: data.name,
        sourceUrl: sourceUrl,
      }));
    } catch (error) {
      console.error('Error fetching data:', error);
      return [];
    }
  };

  useEffect(() => {
    const loadData = async () => {
      if (!source) {
        setLoading(false);
        return;
      }

      const apps = await fetchAppsData(source);
      const foundApp = apps.find(app => app.bundleIdentifier === id);
      setApp(foundApp);
      setLoading(false);
    };

    loadData();
  }, [id, source]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  if (!app) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>App not found!</Text>
        <Button title="Go Back" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: app.iconURL }} style={styles.icon} />
      <Text style={styles.title}>{app.name}</Text>
      <Text style={styles.source}>Source: {app.sourceName}</Text>
      <Text style={styles.description}>{app.localizedDescription}</Text>

      <Button title="Install with AltStore" onPress={() => {/* Install logic */}} />
      <Button title="Install with SideStore" onPress={() => {/* Install logic */}} />
      <Button title="Install with TrollStore" onPress={() => {/* Install logic */}} />
      <Button title="Install with eSign (Beta)" onPress={() => {/* Install logic */}} />

      <Button title="Go Back" onPress={() => router.back()} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FF4A4A',
  },
  icon: {
    width: 100,
    height: 100,
    marginBottom: 20,
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  source: {
    color: 'lightgray',
    textAlign: 'center',
    marginVertical: 10,
  },
  description: {
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default AppDetail;