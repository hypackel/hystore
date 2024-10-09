import React, { useState, useEffect } from "react";
import {
	FlatList,
	Text,
	View,
	ActivityIndicator,
	Image,
	Pressable,
	TextInput,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { EventRegister } from "react-native-event-listeners";


import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
	const [appsData, setAppsData] = useState([]);
	const [filteredData, setFilteredData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");

	// Track pressed item state
	const [pressedItem, setPressedItem] = useState(null);

	const fetchData = async (repos) => {
		setLoading(true);
		try {
			const urls = [...repos];
			const fetchedData = await Promise.all(
				urls.map(async (url) => {
					const response = await fetch(url);
					return await response.json();
				}),
			);

			const combinedApps = fetchedData.flatMap((source, index) => {
				return source.apps.map((app) => ({
					...app,
					sourceName: source.name,
					sourceUrl: urls[index],
				}));
			});

			setAppsData(combinedApps);
			setFilteredData(combinedApps);
		} catch (error) {
			console.error("Error fetching data:", error);
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	};

	const loadCustomRepos = async () => {
		const customReposJson = await AsyncStorage.getItem("customRepos");
		return JSON.parse(customReposJson) || [];
	};

  useEffect(() => {
    // Load initial data
    const loadData = async () => {
      const repos = await loadCustomRepos();
      fetchData(repos);
    };
    loadData();
  
    // Listen for AsyncStorage changes and refetch data
    const subscription = EventRegister.addEventListener('customReposChanged', async () => {
      const repos = await loadCustomRepos();
      fetchData(repos);
    });
  
    // Cleanup the event listener
    return () => {
      EventRegister.removeEventListener(subscription);
    };
  }, []);
  
  

	const onRefresh = async () => {
		setRefreshing(true);
		const repos = await loadCustomRepos();
		fetchData(repos);
	};

	const handleSearch = (query) => {
		setSearchQuery(query);
		if (query) {
			const filtered = appsData.filter((app) =>
				app.name.toLowerCase().includes(query.toLowerCase()),
			);
			setFilteredData(filtered);
		} else {
			setFilteredData(appsData);
		}
	};

	const renderAppItem = ({ item }) => {
		const isPressed = pressedItem === item.bundleIdentifier;

		return (
			<Pressable
				style={{
					flex: 1,
					marginHorizontal: 8,
					opacity: isPressed ? 0.5 : 1,
					marginBottom: 16,
					backgroundColor: "#242424", // Change background on press
					borderRadius: 12,
					overflow: "hidden",
					shadowColor: "#000",
					shadowOffset: { width: 0, height: 2 },
					shadowOpacity: 0.8,
					shadowRadius: 5,
					elevation: 4, // Card shadow for depth
				}}
				onPressIn={() => setPressedItem(item.bundleIdentifier)} // Set pressed item
				onPressOut={() => setPressedItem(null)} // Reset pressed item
				onPress={() =>
					router.push(
						`/detail/${item.bundleIdentifier}?source=${encodeURIComponent(item.sourceUrl)}`,
					)
				}
			>
				<View
					style={{ flexDirection: "row", padding: 16, alignItems: "center" }}
				>
					<Image
						source={{ uri: item.iconURL }}
						style={{ borderRadius: 8, width: 64, height: 64, marginRight: 16 }}
					/>
					<View style={{ flex: 1 }}>
						<Text style={{ color: "#FFF", fontWeight: "bold", fontSize: 18 }}>
							{item.name}
						</Text>
						<Text style={{ color: "#CCC", marginTop: 4 }}>
							Source: {item.sourceName}
						</Text>
						<Text style={{ color: "#888", marginTop: 4 }} numberOfLines={2}>
							{item.localizedDescription}
						</Text>
					</View>
				</View>
			</Pressable>
		);
	};

	return (
		<View style={{ flex: 1, backgroundColor: "#121212" }}>
			<View style={{ padding: 16, backgroundColor: "#1F1F1F" }}>
				<Text
					style={{
						color: "#FFF",
						fontWeight: "bold",
						fontSize: 24,
						marginBottom: 16,
					}}
				>
					Apps
				</Text>
				<TextInput
					placeholder="Search apps..."
					placeholderTextColor="#888"
					value={searchQuery}
					onChangeText={handleSearch}
					style={{
						height: 40,
						borderColor: "#444",
						borderWidth: 1,
						borderRadius: 8,
						paddingHorizontal: 10,
						color: "#FFF",
						backgroundColor: "#2C2C2C",
						marginBottom: 16,
					}}
				/>
			</View>
			<Text>{"\n"}</Text>
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