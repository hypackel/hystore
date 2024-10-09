import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        {/* App info */}
        <View style={styles.appInfo}>
          <Image 
            source={{ uri: 'https://placehold.it/500' }} // replace with the appropriate image URI or import
            style={styles.appIcon}
          />
          <View style={styles.appDetails}>
            <Text style={styles.appTitle}>Delta</Text>
            <Text style={styles.developerText}>Riley Testut</Text>
          </View>
          <TouchableOpacity style={styles.freeButton}>
            <Text style={styles.freeButtonText}>FREE</Text>
          </TouchableOpacity>
        </View>

        {/* Description */}
        <Text style={styles.descriptionText}>Classic games in your pocket.</Text>

        {/* Game preview images */}
        <View style={styles.gamePreview}>
          <Image 
            source={{ uri: 'https://placehold.it/500' }} // replace with the appropriate image URI or import
            style={styles.gameImage}
          />
          <Image 
            source={{ uri: 'https://placehold.it/500' }} // replace with the appropriate image URI or import
            style={styles.gameImage}
          />
        </View>

        {/* App description */}
        <Text style={styles.appDescription}>
          Delta is an all-in-one emulator for iOS. Delta builds upon the strengths of its predecessor, GBA4iOS,
          while expanding to include support for more game systems such as NES, SNES, and N64.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    fontSize: 20,
    color: '#888',
  },
  timeText: {
    fontSize: 16,
    color: '#888',
  },
  appInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  appIcon: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  appDetails: {
    flex: 1,
    marginLeft: 10,
  },
  appTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  developerText: {
    fontSize: 14,
    color: '#666',
  },
  freeButton: {
    backgroundColor: '#E0BBFF',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
  },
  freeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  descriptionText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
  },
  gamePreview: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  gameImage: {
    width: 150,
    height: 250,
    borderRadius: 10,
  },
  appDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 10,
  },
  navText: {
    fontSize: 14,
    color: '#888',
  },
});
