import { Tabs } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function RootLayout() {
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
		<Tabs
			screenOptions={{
				tabBarStyle: {
					backgroundColor: "#1c1c1c",
					borderTopColor: "#1c1c1c",
				},
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					href: "/", // Explicitly set the href
					tabBarIcon: ({ color }) => (
						<Feather name="home" color={color} size={24} />
					),
					tabBarLabel: "Home",
					tabBarActiveTintColor: "#FF4A4A",
					headerTitle: "",
					headerShown: true,
					headerStyle: {
						backgroundColor: "#1c1c1c", // Change to match the tab bar color
						elevation: 0,
						shadowOpacity: 0,
						borderBottomWidth: 0,
						height: 40, // Make the header smaller by setting a smaller height
					},
				}}
			/>

			<Tabs.Screen
				name="news"
				options={{
					// href: "/news",
					tabBarIcon: ({ color }) => (
						<FontAwesome name="newspaper-o" size={24} color={color} />
					),
					tabBarLabel: "News",
					tabBarActiveTintColor: "#ef44ef",
					headerTitle: "",
					headerShown: true,
					headerStyle: {
						backgroundColor: "#1c1c1c", // Match the background color
						elevation: 0,
						shadowOpacity: 0,
						borderBottomWidth: 0,
						height: 40, // Make the header smaller
					},
				}}
			/>

			<Tabs.Screen
				name="repos"
				options={{
					href: "/repos", // Explicitly set the href
					tabBarIcon: ({ color }) => (
						<FontAwesome6 color={color} name="folder-open" size={24} />
					),
					tabBarLabel: "Repos",
					tabBarActiveTintColor: "#34d8ff",
					headerTitle: "",
					headerShown: true,
					headerStyle: {
						backgroundColor: "#1c1c1c", // Match the background color
						elevation: 0,
						shadowOpacity: 0,
						borderBottomWidth: 0,
						height: 40, // Make the header smaller
					},
				}}
			/>
			<Tabs.Screen
				name="settings"
				options={{
					href: "/settings", // Explicitly set the href
					tabBarIcon: ({ color }) => (
						<AntDesign name="setting" size={24} color={color} />
					),
					tabBarLabel: "Settings",
					tabBarActiveTintColor: "#44ef9a",
					headerTitle: "",
					headerShown: true,
					headerStyle: {
						backgroundColor: "#1c1c1c", // Match the background color
						elevation: 0,
						shadowOpacity: 0,
						borderBottomWidth: 0,
						height: 40, // Make the header smaller
					},
				}}
			/>
		</Tabs>
		</GestureHandlerRootView>
	);
}
