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
	TouchableOpacity,
} from "react-native";
import { MainStackNavigationProps } from "../routes/MainStack";
import { useNavigation } from "expo-router";

interface Badge {
	name: string;
	description: string;
	// iconUri: any;
	imageUrl: any;
}

const badgesData = [
	{
		id: 1,
		name: "First Step Badge",
		description: "For getting 500 total score",
		imageUrl: "https://kylesethgray.com/content/images/2018/08/thanksgiving_day_challenge_5k.png",
		requiredScore: 500
	},
	{
		id: 2,
		name: "Second Step Badge",
		description: "For getting 1000 total score",
		imageUrl: "https://kylesethgray.com/content/images/2018/08/new_year_2017.png",
		requiredScore: 1000
	},
	{
		id: 3,
		name: "Five Steps Badge",
		description: "For getting 5000 total score",
		imageUrl: "https://kylesethgray.com/content/images/2018/08/VeteransDay_Sticker.png",
		requiredScore: 5000
	},
	{
		id: 5,
		name: "Consistency Champion",
		description: "For completing activities 7 days in a row",
		imageUrl: "https://media.istockphoto.com/id/905084084/vector/bw-icon-finish-line.jpg?s=612x612&w=0&k=20&c=lhUJ8l42IlT9JX6g7AR7wG5a3FarXNtZq6Q4yUT-wSA=",
		requiredScore: 2500,
		specialRequirement: "7-day streak"
	},
];

// Temporary data for testing
const badgesUnlocked: Badge[] = badgesData;

const { width } = Dimensions.get("window");

export default function UnlockedBadgeScreen() {
	const [currentIndex, setCurrentIndex] = useState(0);
	const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 };
	const navigation = useNavigation<MainStackNavigationProps>();
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
						{/* <Image source={item.iconUri} style={styles.image} /> */}
						<Image source={{ uri: item.imageUrl }} style={styles.image} />
						<Text style={styles.title}>{item.name}</Text>
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

			<TouchableOpacity
				style={{
					alignItems: "center",
					backgroundColor: "#F99E16",
					borderRadius: 12,
					padding: 14,
					alignSelf: "stretch",
					marginBottom: 12,
					marginHorizontal: 16,
				}} onPress={() => {
					navigation.reset({
						index: 0,
						routes: [{ name: "MainTabs" }],
					})
				}}>
				<Text
					style={{
						fontSize: 16,
						textAlign: "center",
					}}>
					{"Continue"}
				</Text>
			</TouchableOpacity>
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
		bottom: 90,
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
