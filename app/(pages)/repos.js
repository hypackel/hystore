import React, { useEffect, useState } from "react";
import {
	View,
	TextInput,
	FlatList,
	Text,
	Pressable,
	ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CustomReposScreen = () => {
	const [repoUrl, setRepoUrl] = useState("");
	const [customRepos, setCustomRepos] = useState([]);

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

	const reloadApps = () => {
		// Implement your logic to reload apps here, if necessary
	};

	const handleAddRepo = () => {
		const trimmedUrl = repoUrl.trim();
		if (trimmedUrl) {
			addCustomRepo(trimmedUrl);
			setRepoUrl(""); // Clear input
		}
	};

	const renderRepoItem = ({ item }) => {
		return (
			<View style={styles.repoItem}>
				<Text style={styles.repoText}>{item}</Text>
				<Pressable onPress={() => removeCustomRepo(item)}>
					<Text style={styles.removeButton}>Remove</Text>
				</Pressable>
			</View>
		);
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Custom Repos</Text>
			<TextInput
				style={styles.input}
				placeholder="Add new repository URL"
				placeholderTextColor="#888"
				value={repoUrl}
				onChangeText={setRepoUrl}
			/>
			<Pressable style={styles.addButton} onPress={handleAddRepo}>
				<Text style={styles.addButtonText}>Add Repository</Text>
			</Pressable>

			<FlatList
				data={customRepos}
				renderItem={renderRepoItem}
				keyExtractor={(item) => item}
				style={styles.repoList}
			/>
		</View>
	);
};

const styles = {
	container: {
		flex: 1,
		padding: 16,
		backgroundColor: '#1F1F1F',
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#FFF',
		marginBottom: 16,
	},
	input: {
		height: 40,
		borderColor: '#444',
		borderWidth: 1,
		borderRadius: 8,
		paddingHorizontal: 10,
		backgroundColor: '#2C2C2C',
		color: '#FFF',
		marginBottom: 16,
	},
	addButton: {
		backgroundColor: '#4A90E2',
		padding: 12,
		borderRadius: 8,
		alignItems: 'center',
		marginBottom: 16,
	},
	addButtonText: {
		color: '#FFF',
		fontSize: 16,
		fontWeight: 'bold',
	},
	repoList: {
		marginTop: 16,
	},
	repoItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 10,
		backgroundColor: '#2C2C2C',
		borderRadius: 8,
		marginBottom: 8,
	},
	repoText: {
		color: '#FFF',
		fontSize: 16,
	},
	removeButton: {
		color: '#FF6B6B',
		fontWeight: 'bold',
	},
};

export default CustomReposScreen;
