import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, ActivityIndicator, Linking } from 'react-native';

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

  useEffect(() => {
    const fetchNews = async () => {
      try {
        let allNews = [];
        for (const repo of defaultRepos) {
          const response = await fetch(repo);
          const data = await response.json();

          if (data.news) {
            allNews = [...allNews, ...data.news]; // Collect news articles
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

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#00ff00" />
        <Text className="text-white">Fetching news...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="p-4 bg-zinc-900">
      <Text className="text-2xl font-bold text-white mb-4">Latest News</Text>
      {news.map((item, index) => (
        <View key={index} className="mb-6">
          <Text className="text-xl font-bold text-white mb-2">{item.title}</Text>
          {item.imageURL && (
            <Image
              source={{ uri: item.imageURL }}
              style={{ height: 150, width: '100%', borderRadius: 8 }}
              resizeMode="cover"
            />
          )}
          <Text className="text-gray-400 mb-2">{item.date}</Text>
          <Text className="text-gray-200 mb-4">{item.caption}</Text>
          {item.url && (
            <Text
              className="text-blue-500 underline"
              onPress={() => {
                // Navigate to external news URL
                Linking.openURL(item.url);
              }}
            >
              Read More
            </Text>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

export default NewsSection;
