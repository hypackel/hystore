import { Stack } from "expo-router";
import "../global.css";  // Assuming you are using global styles

export default function RootLayout() {
	return (
		<Stack screenOptions={{ gestureEnabled: true }}>
			<Stack.Screen
				name="(pages)" // This contains your Tab navigator
				options={{ headerShown: false }}
			/>
			<Stack.Screen name="detail/[id]" options={{ gestureEnabled: true, tabBarLabel: "Home",
					headerTitle: "",
					headerShown: true,
					headerBackTitle: "Back",
					headerStyle: {
						backgroundColor: "#1c1c1c",  // Change to match the tab bar color
						elevation: 0,
						shadowOpacity: 0,
						borderBottomWidth: 0,
						height: 40,  // Make the header smaller by setting a smaller height
					}, }} />
			<Stack.Screen name="+not-found" />
		</Stack>
	);
}
