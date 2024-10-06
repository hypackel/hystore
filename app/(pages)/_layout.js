import { Tabs } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export default function RootLayout() {
	return (
		<Tabs
			screenOptions={{
				tabBarStyle: {
					backgroundColor: "#1c1c1c", // Use tabBarStyle for background color
					borderTopColor: "#1c1c1c",
				},
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					tabBarIcon: ({ color }) => (
						<Feather name="home" color={color} size={24} />
					),
                    tabBarLabel: "Home",
                    tabBarActiveTintColor: "#FF4A4A",
					headerTitle: "",
					headerShown: true,
					headerStyle: {
						backgroundColor: "#FF4A4A", // Background color of header
						elevation: 0, // Remove border shadow on Android
						shadowOpacity: 0, // Remove shadow on iOS
						borderBottomWidth: 0, // Remove bottom border
					},
				}}
			/>
			<Tabs.Screen
				name="repos"
				options={{
					tabBarIcon: ({ color }) => (
						<FontAwesome6 color={color} name="folder-open" size={24} />
					),
                    tabBarLabel: "Repos",
                    tabBarActiveTintColor: "#34d8ff",
					headerTitle: "",
					headerShown: true,
                    headerStyle: {
						backgroundColor: "#89c4de", // Background color of header
						elevation: 0, // Remove border shadow on Android
						shadowOpacity: 0, // Remove shadow on iOS
						borderBottomWidth: 0, // Remove bottom border
					},
				}}
			/>
		</Tabs>
	);
}
