import { Stack } from "expo-router";
import "../global.css"

export default function RootLayout() {
	return (
        <Stack>
			<Stack.Screen
				name="(pages)"
				options={{ headerShown: false }}
			/>
			 <Stack.Screen name="+not-found" />
		</Stack>
	);
}
