import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	ActivityIndicator,
	ScrollView,
	Pressable,
	StyleSheet,
	Linking,
	Modal,
	TouchableOpacity,
	Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import FallbackImage from "../components/DetailFallback";
import { Image } from "expo-image";
import * as RNImage from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";

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
		console.log("Opening modal with image URL:", imageUrl); // Add this line
		setSelectedImage(imageUrl);
		setModalVisible(true);
	};

	const formatDate = (timestamp) => {
		const date = new Date(timestamp);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			// hour: '2-digit',
			// minute: '2-digit',
			// second: '2-digit',
			// timeZoneName: 'short',
		});
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
					<View className="absolute right-0 m-2 top-[95px] px-4 py-[0.5] bg-[#1f1f1fec] rounded-2xl z-30 shadow-md w-full max-w-[96.5%]">
						<View style={styles.appInfo}>
							{app.iconURL && (
								<FallbackImage
									iconURL={{ uri: app.iconURL }}
									style={styles.appIcon}
								/>
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
					<View className="relative w-screen h-72 m-0 p-0 overflow-hidden">
						{/* Blurred background */}
						{Platform.OS === "ios" ? (
							<>
								<RNImage.Image
									source={{ uri: app.iconURL }}
									style={{
										resizeMode: "cover",
										height: "100%",
									}}
									blurRadius={4}
								/>
								{/* <BlurView intensity={50} style={{ height: "100%" }} /> */}
							</>
						) : (
							<Image
								source={{ uri: app.iconURL }}
								style={{
									resizeMode: "cover",
									height: "100%",
								}}
								blurRadius={20} // For Android
							/>
						)}

						{/* Centered clear icon */}
					</View>
				)}

				<View style={styles.descriptionContainer}>
					<View style={styles.detailItemsContainer}>
						{app.sourceName && (
							<View style={styles.detailItem}>
								<MaterialIcons name="source" size={20} color="#8f8d8d" />
								<Text style={styles.detailText}>Source: {app.sourceName}</Text>
							</View>
						)}
						{app.version && (
							<View style={styles.detailItem}>
								<MaterialIcons name="info" size={20} color="#8f8d8d" />
								<Text style={styles.detailText}>Version: {app.version}</Text>
							</View>
						)}
						{app.versionDate && (
							<View style={styles.detailItem}>
								<MaterialIcons name="info" size={20} color="#8f8d8d" />
								<Text style={styles.detailText}>
									Version Date: {formatDate(app.versionDate)}
								</Text>
							</View>
						)}
						{app.bundleIdentifier && (
							<View style={styles.detailItem}>
								<MaterialIcons name="code" size={20} color="#8f8d8d" />
								<Text style={styles.detailText}>
									Bundle ID: {app.bundleIdentifier}
								</Text>
							</View>
						)}
						{app.size && (
							<View style={styles.detailItem}>
								<MaterialIcons name="storage" size={20} color="#8f8d8d" />
								<Text style={styles.detailText}>
									Size: {(app.size / 1024 / 1024).toFixed(2)} MB
								</Text>
							</View>
						)}
					</View>

					{/* Screenshot Thumbnails */}
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						className="mb-11 mt-4"
					>
						<View className="flex-row">
							{app.screenshotURLs?.map((url, index) => (
								<Pressable
									key={index}
									className="mx-2"
									onPress={() => openModal(url)}
								>
									<View className="p-2" style={styles.imageContainer}>
										<RNImage.Image
											source={{ uri: url }}
											className="w-[270px] h-[600px] object-cover"
											style={styles.screenshotImage}
										/>
									</View>
								</Pressable>
							))}
						</View>
					</ScrollView>

					{app.localizedDescription && (
						<Text className="text-white text-center my-4">
							{app.localizedDescription}
						</Text>
					)}
				</View>

			</ScrollView>

			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={closeModal}
			>
				<View style={styles.modalContainer}>
					<ScrollView
						horizontal
						pagingEnabled
						showsHorizontalScrollIndicator={false}
						snapToInterval={336} // Match the width of your modal image
						decelerationRate="fast"
						contentContainerStyle={{ paddingHorizontal: 0 }} // Remove padding
					>
						{app.screenshotURLs?.map((url, index) => (
							<Image
								key={index}
								source={{ uri: url }}
								style={styles.modalImage}
							/>
						))}
					</ScrollView>
					<Pressable style={styles.closeButton} onPress={closeModal}>
						<Text style={styles.closeButtonText}>Done</Text>
					</Pressable>
				</View>
			</Modal>
		</>
	);
};

const styles = StyleSheet.create({
    appInfo: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 20,
    },
    appIcon: {
        width: 65,
        height: 65,
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
        color: "#8f8d8d",
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
    descriptionContainer: {
        backgroundColor: "#1F1F1F", // Gray background
        padding: 20,
        borderTopLeftRadius: 30, // Rounded top-left corner
        borderTopRightRadius: 30, // Rounded top-right corner
        shadowColor: "#000", // Shadow for floating effect
        shadowOffset: { width: 0, height: -6 }, // Only top shadow
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 4, // For Android shadow
        marginTop: -30, // Slight overlap to hide the edge between sections
    },
    detailItemsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap', // Allows the items to wrap to the next line
        justifyContent: 'space-between', // Distributes space between items
    },
    detailItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#2E2E2E", // Background for each item
        borderRadius: 15,
        padding: 8,
        marginBottom: 10, // Add margin between items vertically
        marginRight: 10, // Space between items
        paddingHorizontal: 5, // Adjust padding for horizontal spacing
    },
    detailText: {
        color: "#8f8d8d",
        marginLeft: 5, // Space between icon and text
    },
    imageContainer: {
        overflow: "hidden",
        borderRadius: 25, // Ensure rounded edges for the container
        marginRight: -10, // Slight overlap to create a closer look
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 2, // For Android shadow
    },
    screenshotImage: {
        borderRadius: 20, // Ensure images have rounded corners to match the container
    },
    detailsContainer: {
        paddingVertical: 10, // Add some vertical padding for aesthetics
        paddingHorizontal: 10, // Add horizontal padding to the container
        backgroundColor: "#1F1F1F", // Match background color
        borderTopLeftRadius: 30, // Rounded corners for aesthetics
        borderTopRightRadius: 30,
        shadowColor: "#000", // Shadow for floating effect
        shadowOffset: { width: 0, height: -6 }, // Only top shadow
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 4, // For Android shadow
    },
    modalContainer: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 1)",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 20,
        paddingHorizontal: 0, // Make sure there's no horizontal padding
    },
    modalImage: {
        width: 336, // Width of each image
        height: 704, // Height of each image
        borderRadius: 20, // Rounded corners
        top: 70,
        overflow: "hidden", // Ensure rounded corners are respected
        marginHorizontal: 7, // Margin between images
    },
    noImageText: {
        color: "white",
        fontSize: 18,
        textAlign: "center",
    },
    closeButton: {
        position: "absolute",
        top: 40,
        right: 20,
        padding: 10,
    },
    closeButtonText: {
        color: "#007AFF",
        fontSize: 18,
    },
});

export default AppDetail;
