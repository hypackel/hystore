import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	Image,
	ActivityIndicator,
	ScrollView,
	Button,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

const AppDetail = () => {
	const router = useRouter();
	const { id, source } = useLocalSearchParams();
	const [app, setApp] = useState(null);
	const [loading, setLoading] = useState(true);

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

	useEffect(() => {
		const loadData = async () => {
			if (!source) {
				setLoading(false);
				return;
			}

			const apps = await fetchAppsData(source);
			const foundApp = apps.find((app) => app.bundleIdentifier === id);
			setApp(foundApp);
			setLoading(false);
		};

		loadData();
	}, [id, source]);

	if (loading) {
		return (
			<View className="flex-1 p-5 bg-[#44ef9a] items-center justify-center">
				<ActivityIndicator size="large" color="#ffffff" />
			</View>
		);
	}

	if (!app) {
		return (
			<View className="flex-1 p-5 bg-[#44ef9a] items-center justify-center">
				<Text className="text-black text-2xl font-bold text-center">
					App not found!
				</Text>
				<Button title="Go Back" onPress={() => router.back()} />
			</View>
		);
	}

	const installWithAltStore = () => {
		const altStoreURL = `altstore://install?url=${encodeURIComponent(app.downloadURL)}`;
		router.replace(altStoreURL); // Replace the current route with altStoreURL;
	};

	const installWithSideStore = () => {
		const sideStoreURL = `sidestore://source?url=${encodeURIComponent(app.downloadURL)}`;
		router.replace(sideStoreURL);
	};

	const installWithTrollStore = () => {
		const trollStoreURL = `apple-magnifier://install?url=${encodeURIComponent(app.downloadURL)}`;
		router.replace(trollStoreURL); // Replace the current route with trollStoreURL;
	};

	return (
		<ScrollView className="flex-1 p-5 bg-[#44ef9a]">
			<Button title="Go Back" onPress={() => router.back()} />
			<Image
				source={{ uri: app.iconURL }}
				className="w-24 h-24 mb-5 self-center rounded-md"
			/>
			<Text className="text-black text-2xl font-bold text-center">
				{app.name}
			</Text>
			<Text className="text-light-gray text-center my-2">
				Source: {app.sourceName}
			</Text>
			<Text className="text-black mb-5 text-center">
				{app.localizedDescription}
			</Text>

			<Button
				title="Install with AltStore"
				onPress={installWithAltStore}
			/>
			<Button
				title="Install with SideStore"
				onPress={installWithSideStore}
			/>
			<Button
				title="Install with TrollStore"
				onPress={installWithTrollStore}
			/>
		</ScrollView>
	);
};

export default AppDetail;
