import React, { useState, useEffect } from "react";
import {
	FlatList,
	Text,
	View,
	ActivityIndicator,
	TouchableOpacity,
	Modal,
	Pressable,
	StyleSheet,
	TextInput,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import AppItemImage from "../components/AppIcon";
import { router } from "expo-router";
import { EventRegister } from "react-native-event-listeners";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
	const [appsData, setAppsData] = useState([]);
	const [filteredData, setFilteredData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [filterModalVisible, setFilterModalVisible] = useState(false);
	const [sortOption, setSortOption] = useState("default"); // "date" or "alphabetical"

	// Track pressed item state
	const [pressedItem, setPressedItem] = useState(null);

	// Default repos to add on first launch
	const defaultRepos = [
		"https://community-apps.sidestore.io/sidecommunity.json",
		"https://corsproxy.io/?https%3A%2F%2Fraw.githubusercontent.com%2FBalackburn%2FYTLitePlusAltstore%2Fmain%2Fapps.json",
		"https://tiny.one/SpotC",
		"https://repo.apptesters.org",
		"https://randomblock1.com/altstore/apps.json",
		"https://qnblackcat.github.io/AltStore/apps.json",
		"https://corsproxy.io/?https://esign.yyyue.xyz/app.json",
		"https://corsproxy.io/?https://wuxu1.github.io/wuxu-complete-plus.json",
		"https://corsproxy.io/?https%3A%2F%2Fwuxu1.github.io%2Fwuxu-complete.json",
		"https://raw.githubusercontent.com/vizunchik/AltStoreRus/master/apps.json",
		"https://quarksources.github.io/dist/quantumsource.min.json",
		"https://corsproxy.io/?https%3A%2F%2Fipa.cypwn.xyz%2Fcypwn.json",
	];

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

	const saveCustomRepos = async (repos) => {
		await AsyncStorage.setItem("customRepos", JSON.stringify(repos));
	};

	useEffect(() => {
		const loadData = async () => {
			const customReposJson = await AsyncStorage.getItem("customRepos");
			if (!customReposJson) {
				await saveCustomRepos(defaultRepos);
			}
			const repos = await loadCustomRepos();
			fetchData(repos);
		};
		loadData();

		const subscription = EventRegister.addEventListener(
			"customReposChanged",
			async () => {
				const repos = await loadCustomRepos();
				fetchData(repos);
			},
		);

		return () => {
			EventRegister.removeEventListener(subscription);
		};
	}, []);

	const onRefresh = async () => {
		setRefreshing(true);
		const repos = await loadCustomRepos();
		fetchData(repos);
		setSortOption("default"); // Reset to default sorting when refreshing
		setFilteredData(appsData); // Reset the filtered data to the original
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

	const sortApps = (option) => {
		setSortOption(option);
		setFilterModalVisible(false);

		let sortedData;
		if (option === "date") {
			sortedData = [...filteredData].sort((a, b) => {
				const dateA = a.version[0]?.date || ""; // Get latest version date
				const dateB = b.version[0]?.date || "";
				return new Date(dateB) - new Date(dateA); // Sort by date (most recent first)
			});
		} else if (option === "alphabetical") {
			sortedData = [...filteredData].sort((a, b) =>
				a.name.localeCompare(b.name),
			);
		} else {
			// If default, reset to original data
			sortedData = [...appsData];
		}

		setFilteredData(sortedData);
	};

	const renderAppItem = ({ item }) => {
		const isPressed = pressedItem === item.bundleIdentifier + item.sourceUrl;

		return (
			<Pressable
				style={{
					flex: 1,
					marginHorizontal: 8,
					opacity: isPressed ? 0.5 : 1,
					marginBottom: 16,
					backgroundColor: "#242424",
					borderRadius: 12,
					overflow: "hidden",
					shadowColor: "#000",
					shadowOffset: { width: 0, height: 2 },
					shadowOpacity: 0.8,
					shadowRadius: 5,
					elevation: 4,
				}}
				onPressIn={() => setPressedItem(item.bundleIdentifier + item.sourceUrl)}
				onPressOut={() => setPressedItem(null)}
				onPress={() =>
					router.push(
						`/detail/${item.bundleIdentifier}?source=${encodeURIComponent(item.sourceUrl)}`,
					)
				}
			>
				<View
					style={{ flexDirection: "row", padding: 16, alignItems: "center" }}
				>
					<AppItemImage iconURL={item.iconURL} />
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
			<View
				style={{
					paddingVertical: 16,
					marginBottom: 16,
					backgroundColor: "#1F1F1F",
				}}
			>
				<View
					style={{
						padding: 16,
						backgroundColor: "#1F1F1F",
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<Text
						style={{
							color: "#FFF",
							fontWeight: "bold",
							fontSize: 24,
						}}
					>
						Apps
					</Text>
					<TouchableOpacity onPress={() => setFilterModalVisible(true)}>
						<Text style={{ color: "#FFF", fontSize: 18 }}>Filter</Text>
					</TouchableOpacity>
				</View>
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
						marginBottom: 10,
						marginHorizontal: 16, // Ensure it aligns with the gray area
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

			<Modal
				animationType="slide"
				transparent={true}
				visible={filterModalVisible}
				onRequestClose={() => setFilterModalVisible(false)}
			>
				<View style={styles.modalContainer}>
					<View style={styles.modalContent}>
						<Text style={styles.modalTitle}>Sort by (beta. more options coming soon)</Text>
						<TouchableOpacity
							onPress={() => sortApps("default")}
							style={styles.optionButton}
						>
							<Text style={styles.optionText}>Default</Text>
						</TouchableOpacity>
						{/* <TouchableOpacity onPress={() => sortApps("date")} style={styles.optionButton}>
				  <Text style={styles.optionText}>Date</Text>
				</TouchableOpacity> */}
						<TouchableOpacity
							onPress={() => sortApps("alphabetical")}
							style={styles.optionButton}
						>
							<Text style={styles.optionText}>Alphabetical</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => setFilterModalVisible(false)}
							style={styles.closeButton}
						>
							<Text style={styles.closeButtonText}>Close</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>

			<StatusBar style="light" />
		</View>
	);
}

const styles = StyleSheet.create({
	modalContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
	},
	modalContent: {
		width: "80%",
		backgroundColor: "#1f1f1f",
		borderRadius: 8,
		padding: 20,
		color: "#FFF",
		alignItems: "center",
	},
	modalTitle: {
		fontSize: 18,
		color: "#FFF",
		fontWeight: "bold",
		marginBottom: 16,
	},
	optionButton: {
		padding: 10,
		color: "#FFF",
		borderBottomWidth: 1,
		borderBottomColor: "#ccc",
		width: "100%",
	},
	optionText: {
		fontSize: 16,
		color: "#FFF",
	},
	closeButton: {
		marginTop: 20,
		backgroundColor: "#1F1F1F",
		padding: 10,
		borderRadius: 8,
	},
	closeButtonText: {
		color: "#FFF",
	},
});
