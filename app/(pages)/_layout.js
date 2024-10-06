import { Tabs } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export default function RootLayout() {
	return (
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
					href: "/",  // Explicitly set the href
					tabBarIcon: ({ color }) => (
						<Feather name="home" color={color} size={24} />
					),
					tabBarLabel: "Home",
					tabBarActiveTintColor: "#FF4A4A",
					headerTitle: "",
					headerShown: true,
					headerStyle: {
						backgroundColor: "#FF4A4A",
						elevation: 0,
						shadowOpacity: 0,
						borderBottomWidth: 0,
					},
				}}
			/>
			<Tabs.Screen
				name="repos"
				options={{
					href: "/repos",  // Explicitly set the href
					tabBarIcon: ({ color }) => (
						<FontAwesome6 color={color} name="folder-open" size={24} />
					),
					tabBarLabel: "Repos",
					tabBarActiveTintColor: "#34d8ff",
					headerTitle: "",
					headerShown: true,
					headerStyle: {
						backgroundColor: "#89c4de",
						elevation: 0,
						shadowOpacity: 0,
						borderBottomWidth: 0,
					},
				}}
			/>
			<Tabs.Screen
				name="detail/[id]"
				options={{
					href: null,  // Set href to null to hide from tab bar
                    headerTitle: "",
                    tabBarLabel: "Repos",
					tabBarActiveTintColor: "#44ef9a",
					headerStyle: {
						backgroundColor: "#44ef9a",
						elevation: 0,
						shadowOpacity: 0,
						borderBottomWidth: 0,
					},
					headerShown: true,  // Optionally hide the header for this screen
				}}
			/>
		</Tabs>
	);
}