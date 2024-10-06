import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	Image,
	ActivityIndicator,
	ScrollView,
	Button,
	TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

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
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color="#ffffff" />
			</View>
		);
	}

	if (!app) {
		return (
			<View style={styles.loadingContainer}>
				<Text style={styles.errorText}>App not found!</Text>
				<Button title="Go Back" onPress={() => router.back()} />
			</View>
		);
	}

	const installWithAltStore = () => {
		const altStoreURL = `altstore://install?url=${encodeURIComponent(app.downloadURL)}`;
		router.replace(altStoreURL);
	};

	const installWithSideStore = () => {
		const sideStoreURL = `sidestore://source?url=${encodeURIComponent(app.downloadURL)}`;
		router.replace(sideStoreURL);
	};

	const installWithTrollStore = () => {
		const trollStoreURL = `apple-magnifier://install?url=${encodeURIComponent(app.downloadURL)}`;
		router.replace(trollStoreURL);
	};

	return (
		<>
			<TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
				<View style={styles.backButtonContainer}>
					<Ionicons name="chevron-back-outline" size={15} style={styles.backIcon} />
					<Text style={styles.backText}>Go Back</Text>
				</View>
			</TouchableOpacity>

			<ScrollView style={styles.container}>
				{app.iconURL && (
					<Image
						source={{ uri: app.iconURL }}
						style={styles.appIcon}
					/>
				)}
				{app.name && (
					<Text style={styles.appTitle}>{app.name}</Text>
				)}
				{app.sourceName && (
					<Text style={styles.appDetailText}>Source: {app.sourceName}</Text>
				)}
				{app.version && (
					<Text style={styles.appDetailText}>Version: {app.version}</Text>
				)}
				{app.bundleIdentifier && (
					<Text style={styles.appDetailText}>Bundle Identifier: {app.bundleIdentifier}</Text>
				)}
				{app.size && (
					<Text style={styles.appDetailText}>
						Size: {(app.size / 1024 / 1024).toFixed(2)} MB
					</Text>
				)}
				{app.localizedDescription && (
					<Text style={styles.descriptionText}>
						Description: {app.localizedDescription}
					</Text>
				)}

				<Button title="Install with AltStore" onPress={installWithAltStore} />
				<Button title="Install with SideStore" onPress={installWithSideStore} />
				<Button title="Install with TrollStore" onPress={installWithTrollStore} />
			</ScrollView>
		</>
	);
};

const styles = {
	container: {
		flex: 1,
		padding: 16,
		backgroundColor: '#1F1F1F',
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#44ef9a',
	},
	errorText: {
		color: '#000',
		fontSize: 24,
		fontWeight: 'bold',
		textAlign: 'center',
	},
	backButton: {
		backgroundColor: '#44ef9a',
		padding: 10,
	},
	backButtonContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	backIcon: {
		color: '#4A90E2',
	},
	backText: {
		color: '#4A90E2',
		marginLeft: 5,
	},
	appIcon: {
		width: 96,
		height: 96,
		borderRadius: 12,
		alignSelf: 'center',
		marginBottom: 16,
	},
	appTitle: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#FFF',
		textAlign: 'center',
		marginBottom: 16,
	},
	appDetailText: {
		fontSize: 16,
		color: '#BBB',
		marginBottom: 8,
	},
	descriptionText: {
		color: '#AAA',
		marginBottom: 16,
	},
};

export default AppDetail;
