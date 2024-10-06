import { Stack, Tabs } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function RootLayout() {
	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: "#EF4444",
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
					headerTitle: "",
					headerShown: true,
					headerStyle: {
						backgroundColor: "#EF4444", // Background color of header
						elevation: 0, // Remove border shadow on Android
						shadowOpacity: 0, // Remove shadow on iOS
						borderBottomWidth: 0, // Remove bottom border
					},
				}}
			/>
			<Tabs.Screen
				name="detail"
				options={{
					tabBarIcon: ({ color }) => (
						<MaterialIcons color={color} name="details" size={24} />
					),
					headerTitle: "Home",
					headerShown: false,
				}}
			/>
		</Tabs>
	);
}
