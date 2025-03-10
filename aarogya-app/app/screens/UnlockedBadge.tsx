import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
	SafeAreaView,
	View,
	FlatList,
	Image,
	Text,
	Dimensions,
	StyleSheet,
} from "react-native";

interface Badge {
	title: string;
	description: string;
	iconUri: any;
}

// Temporary data for testing
const badgesUnlocked: Badge[] = [
	{
		title: "Test 1",
		description: "Testing 1",
		iconUri: require("../../assets/images/arogya_app.jpeg"),
	},
	{
		title: "Test 2",
		description: "Testing 2",
		iconUri: require("../../assets/images/arogya_app.jpeg"),
	},
	{
		title: "Test 3",
		description: "Testing 3",
		iconUri: require("../../assets/images/arogya_app.jpeg"),
	},
];

const { width } = Dimensions.get("window");

export default function UnlockedBadgeScreen() {
	const [currentIndex, setCurrentIndex] = useState(0);
	const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 };
	const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
		if (viewableItems.length > 0) {
			setCurrentIndex(viewableItems[0].index);
		}
	}).current;

	return (
		<SafeAreaView style={styles.container}>
			<View
				style={{
					alignItems: "center",
					justifyContent: "center",
					gap: 10,
					paddingVertical: 10,
					marginHorizontal: 30,
				}}
			>
				<Ionicons name="ribbon" size={36} />
				<Text style={{ fontSize: 26, fontWeight: "bold", textAlign: "center" }}>
					Congrats! You've unlocked new badges!
				</Text>
			</View>
			<FlatList
				data={badgesUnlocked}
				horizontal
				pagingEnabled
				showsHorizontalScrollIndicator={false}
				keyExtractor={(item, index) => index.toString()}
				renderItem={({ item }) => (
					<View style={styles.badgeContainer}>
						<Image source={item.iconUri} style={styles.image} />
						<Text style={styles.title}>{item.title}</Text>
						<Text style={styles.description}>{item.description}</Text>
					</View>
				)}
				viewabilityConfig={viewabilityConfig}
				onViewableItemsChanged={onViewableItemsChanged}
			/>
			<View style={styles.dotContainer}>
				{badgesUnlocked.map((_, index) => (
					<View
						key={index}
						style={[styles.dot, currentIndex === index && styles.activeDot]}
					/>
				))}
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FFFFFF",
		alignItems: "center",
		justifyContent: "center",
	},
	badgeContainer: {
		justifyContent: "center",
		display: "flex",
		width,
		alignItems: "center",
		padding: 20,
	},
	image: {
		width: 350,
		height: 350,
		borderRadius: 10,
		marginBottom: 40,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#333",
		marginBottom: 5,
	},
	description: {
		fontSize: 16,
		color: "#666",
	},
	dotContainer: {
		flexDirection: "row",
		position: "absolute",
		bottom: 20,
		alignSelf: "center",
	},
	dot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: "#ccc",
		marginHorizontal: 4,
	},
	activeDot: {
		backgroundColor: "#333",
		width: 10,
		height: 10,
	},
});
