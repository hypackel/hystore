import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	Image,
	ActivityIndicator,
	ScrollView,
	Pressable,
	StyleSheet,
	Linking,
	Modal,
	FlatList,
	TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { BlurView } from "expo-blur";

const AppDetail = () => {
	const router = useRouter();
	const { id, source } = useLocalSearchParams();
	const [app, setApp] = useState(null);
	const [loading, setLoading] = useState(true);
	const [preferredMethod, setPreferredMethod] = useState("default");
	const [modalVisible, setModalVisible] = useState(false);
	const [getPressed, setGetPressed] = useState(null);
	const [selectedImage, setSelectedImage] = useState(null);

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
				setApp({
					...foundApp,
					downloadURL: foundApp.versions[0].downloadURL,
				});
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
			<View className="flex-1 justify-center items-center bg-[#1c1c1c]">
				<ActivityIndicator size="large" color="#ffffff" />
			</View>
		);
	}

	if (!app) {
		return (
			<View className="flex-1 justify-center items-center bg-[#44ef9a]">
				<Text className="text-black text-xl font-bold">App not found!</Text>
				<Pressable className="mt-4" onPress={() => router.back()}>
					<Text className="text-blue-500">Go Back</Text>
				</Pressable>
			</View>
		);
	}

	const installMethods = {
		altstore: `altstore://install?url=${encodeURIComponent(app.downloadURL)}`,
		sidestore: `sidestore://source?url=${encodeURIComponent(app.downloadURL)}`,
		trollstore: `apple-magnifier://install?url=${encodeURIComponent(app.downloadURL)}`,
		scarlet: `scarlet://install?url=${encodeURIComponent(app.downloadURL)}`,
		tanarasign: `opium://install=${encodeURIComponent(app.downloadURL)}`,
		default: app.downloadURL,
	};

	const handleInstall = (method) => {
		const url = installMethods[method] || installMethods.default;

		if (!url) {
			alert(
				"The URL is undefined. This is a bug in the code, please report it.",
			);
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

	const openModal = (imageUrl) => {
		setSelectedImage(imageUrl);
		setModalVisible(true);
	};

	const closeModal = () => {
		setModalVisible(false);
		setSelectedImage(null);
	};

	return (
		<>
			<ScrollView className="flex-1 bg-[#1F1F1F]">
				{/* App info */}
				<View className="relative z-30">
					<View className="absolute right-0 m-2 mt-20 p-4 bg-[#1F1F1F] rounded-lg z-30 shadow-md w-full max-w-[96.5%]">
						<View style={styles.appInfo}>
							{app.iconURL && (
								<Image source={{ uri: app.iconURL }} style={styles.appIcon} />
							)}
							<View style={styles.appDetails}>
								{app.name && <Text style={styles.appTitle}>{app.name}</Text>}
								{app.developerName && (
									<Text style={styles.developerText}>{app.developerName}</Text>
								)}
							</View>
							<Pressable
								onPressOut={() => setGetPressed(null)}
								onPressIn={() => setGetPressed(true)}
								onPress={() => handleInstall(preferredMethod)}
								style={[styles.freeButton, { opacity: getPressed ? 0.5 : 1 }]}
							>
								<Text style={styles.freeButtonText}>Get</Text>
							</Pressable>
						</View>
					</View>
				</View>

				{/* Blurred App Icon Section */}
				{app.iconURL && (
					<View className="relative w-screen h-60 m-0 p-0 overflow-hidden">
						{/* Blurred background */}
						<BlurView intensity={100}>
							<Image
								source={{ uri: app.iconURL }}
								style={{
									resizeMode: "cover",
									height: "100%",
								}}
								blurRadius={2}
							/>
						</BlurView>

						{/* Centered clear icon */}
					</View>
				)}

				{app.localizedDescription && (
					<Text className="text-white text-center my-4">
						{app.localizedDescription}
					</Text>
				)}

				{/* Screenshot Thumbnails */}
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					className="mb-11"
				>
					<View className="flex-row justify-center space-x-2">
						{app.screenshotURLs?.map((url, index) => (
							<Pressable
								key={index}
								className="mx-4"
								onPress={() => openModal(url)}
							>
								<View className="p-2">
									<Image
										source={{ uri: url }}
										className="w-[330px] h-[500px] object-contain rounded-lg" // Adjust width and height as needed
										resizeMode="contain" // Ensure the image scales properly
									/>
								</View>
							</Pressable>
						))}
					</View>
				</ScrollView>

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
					<Text className="text-gray-400 mb-5">
						Size: {(app.size / 1024 / 1024).toFixed(2)} MB
						{"\n\n\n\n"}
					</Text>
				)}
			</ScrollView>

			{/* Modal for full-screen image */}
			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={closeModal}
			>
				<View className="flex-1 bg-zinc-700 bg-opacity-75 rounded-md justify-center items-center">
					<Image
						source={{ uri: selectedImage }}
						className="w-[130%] h-auto aspect-[3/4] object-contain"
						borderRadius={115}
						resizeMode="contain" // Ensure the image fits well within the modal
					/>
					<TouchableOpacity
						className="absolute top-10 right-10"
						onPress={closeModal}
					>
						<Text className="text-blue-500 text-xl">Done</Text>
					</TouchableOpacity>
				</View>
			</Modal>
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F0F0F0",
	},
	scrollContainer: {
		paddingHorizontal: 16,
		paddingBottom: 50,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginVertical: 10,
	},
	backButton: {
		padding: 10,
	},
	backButtonText: {
		fontSize: 20,
		color: "#888",
	},
	timeText: {
		fontSize: 16,
		color: "#888",
	},
	appInfo: {
		flexDirection: "row",
		alignItems: "center",
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
		fontWeight: "bold",
		color: "#fff",
	},
	developerText: {
		fontSize: 14,
		color: "#666",
	},
	freeButton: {
		backgroundColor: "#007AFF",
		paddingHorizontal: 15,
		paddingVertical: 5,
		borderRadius: 15,
	},
	freeButtonText: {
		color: "#fff",
		fontWeight: "bold",
	},
	descriptionText: {
		fontSize: 16,
		fontWeight: "bold",
		marginVertical: 10,
		textAlign: "center",
	},
	gamePreview: {
		flexDirection: "row",
		justifyContent: "space-around",
		marginBottom: 20,
	},
	gameImage: {
		width: 150,
		height: 250,
		borderRadius: 10,
	},
	appDescription: {
		fontSize: 14,
		color: "#666",
		textAlign: "center",
		marginBottom: 20,
	},
	bottomNav: {
		flexDirection: "row",
		justifyContent: "space-around",
		borderTopWidth: 1,
		borderColor: "#ddd",
		paddingVertical: 10,
	},
	navText: {
		fontSize: 14,
		color: "#888",
	},
});

export default AppDetail;
