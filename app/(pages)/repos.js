import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  TouchableOpacity,
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
      <View className="flex-row justify-between items-center p-3 border-b border-lightgray">
        <Text className="text-base">{item}</Text>
        <TouchableOpacity onPress={() => removeCustomRepo(item)}>
          <Text className="text-red-600 font-bold">Remove</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View className="p-4 h-screen bg-[#89c4de]">
      <TextInput
        className="h-10 border border-gray-400 mb-2 px-2"
        placeholder="Add new repository URL"
        value={repoUrl}
        onChangeText={setRepoUrl}
      />
      <Button title="Add Repository" onPress={handleAddRepo} />
      <FlatList
        data={customRepos}
        renderItem={renderRepoItem}
        keyExtractor={(item) => item}
        className="mt-2"
      />
    </View>
  );
};

export default CustomReposScreen;
