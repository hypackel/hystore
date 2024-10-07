import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	Image,
	ActivityIndicator,
	ScrollView,
	TouchableOpacity,
	Linking, // Import Linking
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { styled } from "nativewind"; // NativeWind import

const AppDetail = () => {
	const router = useRouter();
	const { id, source } = useLocalSearchParams();
	const [app, setApp] = useState(null);
	const [loading, setLoading] = useState(true);
	const [preferredMethod, setPreferredMethod] = useState("default");

	const fetchAppsData = async (sourceUrl) => {
		try {
			const response = await fetch(sourceUrl);
			const data = await response.json();
			return data.apps.map((app) => ({
				...app,
				sourceName: data.name,
				sourceUrl: sourceUrl,
			}));
		} catch (error) {
			console.error("Error fetching data:", error);
			return [];
		}
	};

	const getPreferredMethod = async () => {
		try {
			const storedMethod = await AsyncStorage.getItem("preferredMethod");
			if (storedMethod) {
				setPreferredMethod(storedMethod);
			} else {
				setPreferredMethod("default");
			}
		} catch (error) {
			console.error("Error retrieving preferred method:", error);
		}
	};

	useEffect(() => {
		const loadData = async () => {
			if (!source) {
				setLoading(false);
				return;
			}
	
			const apps = await fetchAppsData(source);
			const foundApp = apps.find((app) => app.bundleIdentifier === id);
	
			if (foundApp && foundApp.versions && foundApp.versions.length > 0) {
				// Set the app with downloadURL from the latest version
				setApp({
					...foundApp,
					downloadURL: foundApp.versions[0].downloadURL, // Use the latest version's download URL
				});
				console.log('Download URL:', foundApp.versions[0].downloadURL);
			} else {
				setApp(foundApp);
			}
	
			setLoading(false);
		};
	
		loadData();
		getPreferredMethod();
	}, [id, source]);
	
	

	if (loading) {
		return (
			<View className="flex-1 justify-center items-center bg-[#44ef9a]">
				<ActivityIndicator size="large" color="#ffffff" />
			</View>
		);
	}

	if (!app) {
		return (
			<View className="flex-1 justify-center items-center bg-[#44ef9a]">
				<Text className="text-black text-xl font-bold">App not found!</Text>
				<TouchableOpacity className="mt-4" onPress={() => router.back()}>
					<Text className="text-blue-500">Go Back</Text>
				</TouchableOpacity>
			</View>
		);
	}

	// Install method handlers
	const installMethods = {
		altstore: `altstore://install?url=${encodeURIComponent(app.downloadURL)}`,
		sidestore: `sidestore://source?url=${encodeURIComponent(app.downloadURL)}`,
		trollstore: `apple-magnifier://install?url=${encodeURIComponent(app.downloadURL)}`,
		scarlet: `scarlet://install?url=${encodeURIComponent(app.downloadURL)}`,
		tanarasign: `opium://install=${encodeURIComponent(app.downloadURL)}`,
		default: app.downloadURL, // Default handler or fallback
	};

	const handleInstall = (method) => {
		const url = installMethods[method] || installMethods.default;

		// Check if URL is defined
		if (!url) {
			alert("The URL is undefined, cannot proceed with the install.");
			return;
		}

		if (method === "default") {
			Linking.openURL(url).catch((err) => {
				console.error("Failed to open URL:", err);
				alert("Error opening the download URL.");
			});
		} else {
			router.replace(url);
		}
	};

	return (
		<>
			<TouchableOpacity
				className="bg-[#1c1c1c] p-3"
				onPress={() => router.back()}
			>
				<View className="flex-row items-center">
					<Ionicons
						name="chevron-back-outline"
						size={15}
						className="text-[#4A90E2]"
					/>
					<Text className="text-[#4A90E2] ml-2">Go Back</Text>
				</View>
			</TouchableOpacity>

			<ScrollView className="flex-1 p-4 bg-[#1F1F1F]">
				{app.iconURL && (
					<Image
						source={{ uri: app.iconURL }}
						className="w-24 h-24 rounded-lg self-center mb-4"
					/>
				)}
				{app.name && (
					<Text className="text-xl font-bold text-white text-center mb-4">
						{app.name}
					</Text>
				)}
				{app.sourceName && (
					<Text className="text-gray-400 mb-2">Source: {app.sourceName}</Text>
				)}
				{app.version && (
					<Text className="text-gray-400 mb-2">Version: {app.version}</Text>
				)}
				{app.bundleIdentifier && (
					<Text className="text-gray-400 mb-2">
						Bundle Identifier: {app.bundleIdentifier}
					</Text>
				)}
				{app.size && (
					<Text className="text-gray-400 mb-2">
						Size: {(app.size / 1024 / 1024).toFixed(2)} MB
					</Text>
				)}
				{app.localizedDescription && (
					<Text className="text-gray-400 mb-4">
						Description: {app.localizedDescription}
					</Text>
				)}

				{/* Install Button */}
				<TouchableOpacity
					className="bg-blue-500 py-3 rounded-lg"
					onPress={() => handleInstall(preferredMethod)}
				>
					<Text className="text-white text-center font-bold">GET</Text>
				</TouchableOpacity>
			</ScrollView>
		</>
	);
};

export default AppDetail;
