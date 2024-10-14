import React, { useEffect, useState } from "react";
import { View, TextInput, FlatList, Text, Pressable } from "react-native";
import { EventRegister } from "react-native-event-listeners";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Swipeable } from 'react-native-gesture-handler';
import Entypo from "@expo/vector-icons/Entypo";

const DEFAULT_REPOS = [
	"https://community-apps.sidestore.io/sidecommunity.json",
	"https://corsproxy.io/?https%3A%2F%2Fraw.githubusercontent.com%2FBalackburn%2FYTLitePlusAltstore%2Fmain%2Fapps.json",
	"https://tiny.one/SpotC",
	"https://repo.apptesters.org",
	"https://randomblock1.com/altstore/apps.json",
	"https://qnblackcat.github.io/AltStore/apps.json",
	"https://esign.yyyue.xyz/app.json",
	"https://bit.ly/wuxuslibraryplus",
	"https://bit.ly/wuxuslibrary",
	"https://raw.githubusercontent.com/vizunchik/AltStoreRus/master/apps.json",
	"https://quarksources.github.io/dist/quantumsource.min.json",
	"https://corsproxy.io/?https%3A%2F%2Fipa.cypwn.xyz%2Fcypwn.json",
];

const CustomReposScreen = () => {
	const [repoUrl, setRepoUrl] = useState("");
	const [customRepos, setCustomRepos] = useState([]);
	const [addButtonPressed, setAddButtonPressed] = useState(null);
	const [resetButtonPressed, setResetButtonPressed] = useState(null);

	useEffect(() => {
		fetchAndDisplayCustomRepos();
	}, []);

	const fetchAndDisplayCustomRepos = async () => {
		try {
			const repos = await AsyncStorage.getItem("customRepos");
			setCustomRepos(JSON.parse(repos) || []);
		} catch (error) {
			console.error("Failed to fetch custom repositories:", error);
		}
	};

	const addCustomRepo = async (url) => {
		const updatedRepos = [...customRepos, url];
		setCustomRepos(updatedRepos);
		await AsyncStorage.setItem("customRepos", JSON.stringify(updatedRepos));
		console.log(`Added custom repo: ${url}`);

		fetchAndDisplayCustomRepos();
		reloadApps();
	};

	const removeCustomRepo = async (url) => {
		const updatedRepos = customRepos.filter((repo) => repo !== url);
		setCustomRepos(updatedRepos);
		await AsyncStorage.setItem("customRepos", JSON.stringify(updatedRepos));
		console.log(`Removed custom repo: ${url}`);
		fetchAndDisplayCustomRepos();
		reloadApps();
	};

	const resetToDefaultRepos = async () => {
		setCustomRepos(DEFAULT_REPOS);
		await AsyncStorage.setItem("customRepos", JSON.stringify(DEFAULT_REPOS));
		console.log("Reset to default repos");
		reloadApps();
	};

	const reloadApps = () => {
		EventRegister.emit("customReposChanged");
	};

	const handleAddRepo = () => {
		const trimmedUrl = repoUrl.trim();
		if (trimmedUrl) {
			addCustomRepo(trimmedUrl);
			setRepoUrl(""); // Clear input
		}
	};

	const renderRightActions = (item) => (
		<Pressable
			onPress={() => removeCustomRepo(item)}
			className="flex justify-center pb-auto h-[42px] items-center p-3 bg-red-500 rounded-md"
		>
			<Entypo className="text-white z-20" name="trash" size={24} color="#fff" />
		</Pressable>
	);

	const renderRepoItem = ({ item }) => {
		return (
			<Swipeable renderRightActions={() => renderRightActions(item)}>
				<View className="flex-row justify-between items-center p-3 bg-zinc-800 rounded-lg mb-2">
					<Text className="text-white text-base truncate line-clamp-1 flex-1 overflow-hidden whitespace-nowrap text-ellipsis">
						{item}
					</Text>
				</View>
			</Swipeable>
		);
	};

	return (
		<View className="flex-1 p-4 bg-zinc-900">
			<Text className="text-3xl font-extrabold text-white mb-4">
				Repositories
			</Text>
			<TextInput
				className="h-10 border border-zinc-700 rounded-lg px-3 bg-zinc-800 text-white mb-4"
				placeholder="Add new repository URL"
				placeholderTextColor="#888"
				value={repoUrl}
				onChangeText={setRepoUrl}
			/>
			<Pressable
				onPressIn={() => setAddButtonPressed(true)}
				onPressOut={() => setAddButtonPressed(null)}
				className={`bg-blue-500 p-3 rounded-lg items-center mb-4 ${
					addButtonPressed ? "opacity-50" : "opacity-100"
				}`}
				onPress={handleAddRepo}
			>
				<Text className="text-white text-base font-bold">Add Repository</Text>
			</Pressable>

			<Pressable
				onPressIn={() => setResetButtonPressed(true)}
				onPressOut={() => setResetButtonPressed(null)}
				className={`bg-red-500 p-3 rounded-lg items-center mb-4 ${
					resetButtonPressed ? "opacity-50" : "opacity-100"
				}`}
				onPress={resetToDefaultRepos}
			>
				<Text className="text-white text-base font-bold">Reset to Default</Text>
			</Pressable>

			<FlatList
				data={customRepos}
				renderItem={renderRepoItem}
				keyExtractor={(item) => item}
				className="mt-4"
			/>
		</View>
	);
};

export default CustomReposScreen;
