import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator, Linking, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const defaultRepos = [
  'https://community-apps.sidestore.io/sidecommunity.json',
  'https://corsproxy.io/?https%3A%2F%2Fraw.githubusercontent.com%2FBalackburn%2FYTLitePlusAltstore%2Fmain%2Fapps.json',
  'https://tiny.one/SpotC',
  'https://repo.apptesters.org',
  'https://randomblock1.com/altstore/apps.json',
  'https://qnblackcat.github.io/AltStore/apps.json',
  'https://esign.yyyue.xyz/app.json',
  'https://bit.ly/wuxuslibraryplus',
  'https://bit.ly/wuxuslibrary',
  'https://raw.githubusercontent.com/vizunchik/AltStoreRus/master/apps.json',
  'https://quarksources.github.io/dist/quantumsource.min.json',
  'https://corsproxy.io/?https%3A%2F%2Fipa.cypwn.xyz%2Fcypwn.json',
];

const NewsSection = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        let allNews = [];
        for (const repo of defaultRepos) {
          const response = await fetch(repo);
          const data = await response.json();

          if (data.news) {
            const newsWithSource = data.news.map((item) => ({
              ...item,
              sourceUrl: repo, // Store the source URL with each news item
            }));
            allNews = [...allNews, ...newsWithSource];
          }
        }

        // Sort news by date, newest first
        allNews.sort((a, b) => new Date(b.date) - new Date(a.date));

        setNews(allNews);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        if (item.appID) {
          router.push(`/detail/${item.appID}?source=${encodeURIComponent(item.sourceUrl)}`);
        } else if (item.url) {
          Linking.openURL(item.url);
        }
      }}
      style={styles.newsItem}
    >
      <Text style={styles.newsTitle}>{item.title}</Text>
      {item.imageURL && (
        <Image
          source={{ uri: item.imageURL }}
          style={styles.newsImage}
          resizeMode="cover"
        />
      )}
      <Text style={styles.newsDate}>{item.date}</Text>
      <Text style={styles.newsCaption}>{item.caption}</Text>
      {!item.appID && item.url && (
        <Text style={styles.newsLink}>Read More</Text>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00ff00" />
        <Text style={styles.loadingText}>Fetching news...</Text>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.headerText}>Latest News</Text>
      <FlatList
        data={news}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.title + index}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.contentContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#181818',
    paddingTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  loadingText: {
    color: '#ffffff',
    marginTop: 10,
  },
  headerText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ffffff',
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: '#181818',
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#303030',
  },
  contentContainer: {
    paddingBottom: 16,
    paddingHorizontal: 8,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  newsItem: {
    backgroundColor: '#242424',
    flex: 1,
    marginHorizontal: 8,
    marginBottom: 16,
    borderRadius: 8,
    padding: 10,
    justifyContent: 'space-between',
    elevation: 3,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  newsImage: {
    height: 120,
    width: '100%',
    borderRadius: 8,
    marginBottom: 8,
  },
  newsDate: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 8,
  },
  newsCaption: {
    fontSize: 14,
    color: '#dddddd',
    marginBottom: 8,
  },
  newsLink: {
    fontSize: 14,
    color: '#1E90FF',
    textDecorationLine: 'underline',
  },
});

export default NewsSection;
