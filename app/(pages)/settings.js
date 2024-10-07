import React, { useState, useEffect } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
	const [preferredMethod, setPreferredMethod] = useState(null);
	const [pressedMethod, setPressedMethod] = useState(null);

	const options = [
		{ id: "default", label: "Default" },
		{ id: "trollstore", label: "TrollStore" },
		{ id: "sidestore", label: "SideStore" },
		{ id: "scarlet", label: "Scarlet" },
		{ id: "altstore", label: "AltStore" },
		{ id: "tanarasign", label: "TanaraSign" },
	];

	// Load preferred method from AsyncStorage
	useEffect(() => {
		(async () => {
			const storedMethod = await AsyncStorage.getItem("preferredMethod");
			if (storedMethod) {
				setPreferredMethod(storedMethod);
			}
		})();
	}, []);

	// Handle button press and store preference
	const selectMethod = async (method) => {
		setPreferredMethod(method);
		await AsyncStorage.setItem("preferredMethod", method);
	};

	return (
		<ScrollView className="flex-1 bg-[#1F1F1F] text-white p-4">
			<Text className="text-xl font-bold mb-2 text-white">Download Method</Text>
			<Text className="text-md mb-4 text-gray-500">
				What app should HyStore use to download apps
			</Text>

			<View className="space-y-4 flex flex-row flex-wrap justify-between">
				{options.map((option) => (
					<Pressable
						key={option.id}
						onPressIn={() => setPressedMethod(option.id)}
						onPressOut={() => setPressedMethod(null)}
						onPress={() => selectMethod(option.id)}
						className={`px-4 py-2 mb-3 rounded-lg w-[48%] ${
							preferredMethod === option.id ? "bg-[#44ef9a]" : "bg-zinc-700"
						} ${pressedMethod === option.id ? "opacity-50" : "opacity-100"}`}
					>
						<Text
							className={`text-center font-bold ${
								preferredMethod === option.id ? "text-black" : "text-white"
							}`}
						>
							{option.label}
						</Text>
					</Pressable>
				))}
			</View>
		</ScrollView>
	);
}
