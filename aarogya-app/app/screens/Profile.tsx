import { useNavigation } from "@react-navigation/native";
import React, { useContext, useMemo } from "react";
import { SafeAreaView, View, ScrollView, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import AppContext from "../auth/AuthContext";
import { ScoreContext } from "../context/ScoreContext";
import * as SecureStore from "expo-secure-store";
import { MainStackNavigationProps } from "../routes/MainStack";

interface Badge {
	id: number;
	name: string;
	description: string;
	imageUrl: string;
	requiredScore: number;
}

const badgesData = [
	{
		id: 1,
		name: "First Step Badge",
		description: "For getting 100 total score",
		imageUrl: "https://kylesethgray.com/content/images/2018/08/thanksgiving_day_challenge_5k.png",
		requiredScore: 100
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
		id: 4,
		name: "Ten Steps Badge",
		description: "For getting 10000 total score",
		imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAjY1PMGuLxgqYTLEr3HIQ-axizoykXbQEhw&s",
		requiredScore: 10000
	},
	{
		id: 5,
		name: "Consistency Champion",
		description: "For completing activities 7 days in a row",
		imageUrl: "https://media.istockphoto.com/id/905084084/vector/bw-icon-finish-line.jpg?s=612x612&w=0&k=20&c=lhUJ8l42IlT9JX6g7AR7wG5a3FarXNtZq6Q4yUT-wSA=",
		requiredScore: 2500,
		specialRequirement: "7-day streak"
	},
	{
		id: 6,
		name: "Recovery Master",
		description: "For reaching 50% of recovery progress",
		imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEIaxAQZLo9O-QIU__us5ENINSWwgvGk5Y0A&s",
		requiredScore: 3000,
		specialRequirement: "50% recovery progress"
	},
	{
		id: 7,
		name: "Health Warrior",
		description: "For maintaining perfect health metrics for 30 days",
		imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQS-EBa1dhAWgEuBzG3R_PgJ5AKBP_NwH0HAQ&s	",
		requiredScore: 7500,
		specialRequirement: "30-day perfect health"
	}
];

export default function ProfileScreen() {
	const navigation = useNavigation<MainStackNavigationProps>();
	const { user } = useContext(AppContext);
	const { totalScore } = useContext(ScoreContext);

	const recoveryProgressPercent = useMemo(() => {
		const maxScore = 10000;
		const progress = Math.min((totalScore / maxScore) * 100, 100);
		return Math.round(progress);
	}, [totalScore]);

	const handleReevaluate = async () => {
		await SecureStore.deleteItemAsync("roadmap");
		navigation.navigate("form", { force: true });
	};

	const { earnedBadges, unearnedBadges } = useMemo(() => {
		const earned = badgesData.filter(badge => totalScore >= badge.requiredScore);
		const unearned = badgesData.filter(badge => totalScore < badge.requiredScore);
		return { earnedBadges: earned, unearnedBadges: unearned };
	}, [totalScore]);

	const renderBadgeItem = (badge: Badge, earned = true) => (
		<View key={badge.id} style={styles.badgeContainer}>
			<Image
				source={{ uri: badge.imageUrl }}
				resizeMode={"stretch"}
				style={[
					styles.badgeImage,
					!earned && styles.disabledBadge
				]}
			/>
			<Text style={styles.badgeName}>
				{badge.name}
			</Text>
			<Text style={styles.badgeDescription}>
				{badge.description}
			</Text>
			{!earned && (
				<View style={styles.targetContainer}>
					<Text style={styles.targetText}>
						{`You need ${badge.requiredScore - totalScore} more points`}
					</Text>
				</View>
			)}
		</View>
	);

	const renderBadgesSection = () => (
		<View style={styles.badgesSection}>
			<Text style={styles.sectionTitle}>Badges</Text>

			{earnedBadges.length === 0 ? (
				<Text style={styles.noBadgesText}>
					No Badges Won Yet. Remember, the right time to start is now! Keep pushing forward and your efforts will pay off.
				</Text>
			) : (
				<>
					<Text style={styles.subsectionTitle}>Earned Achievements</Text>
					<View style={styles.badgesGrid}>
						{earnedBadges.map(badge => renderBadgeItem(badge))}
					</View>
				</>
			)}

			{unearnedBadges.length > 0 && (
				<>
					<Text style={styles.subsectionTitle}>Your Next Targets</Text>
					<Text style={styles.motivationalText}>Keep going! These achievements await you:</Text>
					<View style={styles.badgesGrid}>
						{unearnedBadges.map(badge => renderBadgeItem(badge, false))}
					</View>
				</>
			)}
		</View>
	);

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView style={styles.scrollView}>
				<View style={styles.profileContainer}>
					<View style={styles.headerContainer}>
						<Text style={styles.headerTitle}>User Profile</Text>
					</View>

					<Image
						source={{ uri: "https://picsum.photos/200/200" }}
						resizeMode={"stretch"}
						style={styles.profileImage}
					/>

					<Text style={styles.userName}>
						{user?.name ? user.name : "--"}
					</Text>

					<View style={styles.userDetailsContainer}>
						<View style={styles.detailBox}>
							<Text style={styles.label}>Age:</Text>
							<Text style={styles.value}>{user?.age ?? '-'}</Text>
						</View>
						<View style={styles.detailBox}>
							<Text style={styles.label}>Weight:</Text>
							<Text style={styles.value}>{user?.weight ?? '-'} kg</Text>
						</View>
						<View style={styles.detailBox}>
							<Text style={styles.label}>Height:</Text>
							<Text style={styles.value}>{user?.height ?? '-'} cm</Text>
						</View>
					</View>


					<View style={styles.buttonsContainer}>
						<TouchableOpacity
							style={styles.secondaryButton}
							onPress={handleReevaluate}>
							<Text style={styles.buttonText}>Re-evaluate</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={styles.primaryButton}
							onPress={() => navigation.navigate("Settings")}>
							<Text style={styles.buttonText}>Settings</Text>
						</TouchableOpacity>
					</View>

					<Text style={[styles.progressLabel]}>
						Recovery Progress ({recoveryProgressPercent}%)
					</Text>

					<View style={styles.progressBarContainer}>
						<View
							style={[styles.progressBar, { width: `${recoveryProgressPercent}%` }]}>
						</View>
					</View>

					{renderBadgesSection()}

					<TouchableOpacity
						style={[styles.primaryButton, { marginBottom: 0, width: '80%', justifyContent: 'center', alignSelf: 'center' }]}
						onPress={() => alert('Shared successfully!')}>
						<Text style={[styles.buttonText, { marginBottom: 0, justifyContent: 'center', alignSelf: 'center' }]}>Share on social media</Text>
					</TouchableOpacity>

					<View style={styles.footer}></View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FFFFFF",
	},
	scrollView: {
		flex: 1,
		backgroundColor: "#FFFFFF",
	},
	profileContainer: {
		backgroundColor: "#FCF9F7",
	},
	headerContainer: {
		alignItems: "center",
		marginTop: 20,
		marginBottom: 18,
	},
	headerTitle: {
		color: "#1C160C",
		fontSize: 18,
	},
	profileImage: {
		borderRadius: 64,
		height: 128,
		width: 128,
		marginBottom: 19,
		alignSelf: 'center'
	},
	userName: {
		color: "#1C160C",
		fontSize: 22,
		textAlign: "center",
		marginBottom: 16,
	},
	userDetails: {
		color: "#9E7A47",
		fontSize: 16,
		textAlign: "center",
		marginBottom: 20,
	},
	buttonsContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 24,
		marginHorizontal: 16,
	},
	primaryButton: {
		flex: 1,
		alignItems: "center",
		backgroundColor: "#F99E16",
		borderRadius: 8,
		paddingVertical: 15,
		marginHorizontal: 16,
	},
	secondaryButton: {
		flex: 1,
		alignItems: "center",
		backgroundColor: "#F4EFE5",
		borderRadius: 8,
		paddingVertical: 15,
	},
	buttonText: {
		color: "#1C160C",
		fontSize: 14,
	},
	progressLabel: {
		color: "#9E7A47",
		fontSize: 16,
		marginBottom: 19,
		textAlign: 'center',
	},
	progressBarContainer: {
		backgroundColor: "#F5F0E5",
		borderRadius: 4,
		marginBottom: 29,
		marginHorizontal: 16,
		height: 8,
	},
	progressBar: {
		height: 8,
		backgroundColor: "#F99E16",
		borderRadius: 4,
	},
	badgesSection: {
		marginBottom: 30,
		paddingHorizontal: 16,
	},
	sectionTitle: {
		color: "#1C160C",
		fontSize: 18,
		marginBottom: 24,
	},
	subsectionTitle: {
		color: "#1C160C",
		fontSize: 16,
		marginBottom: 8,
		fontWeight: '600',
	},
	motivationalText: {
		color: "#9E7A47",
		fontSize: 14,
		marginBottom: 16,
		fontStyle: 'italic',
	},
	noBadgesText: {
		color: "#9E7A47",
		fontSize: 16,
		marginBottom: 50,
		fontStyle: 'italic',
	},
	badgesGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
		marginBottom: 24,
	},
	badgeContainer: {
		width: '48%',
		marginBottom: 20,
	},
	badgeImage: {
		borderRadius: 8,
		width: '100%',
		height: 173,
		marginBottom: 8,
	},
	disabledBadge: {
		opacity: 0.5,
	},
	badgeName: {
		color: "#1C160C",
		fontSize: 16,
		marginBottom: 4,
	},
	badgeDescription: {
		color: "#9E7A47",
		fontSize: 14,
		marginBottom: 4,
	},
	targetContainer: {
		backgroundColor: '#F4EFE5',
		paddingVertical: 4,
		paddingHorizontal: 8,
		borderRadius: 4,
		marginTop: 4,
	},
	targetText: {
		color: '#F99E16',
		fontSize: 12,
		fontWeight: '500',
	},
	footer: {
		height: 20,
		backgroundColor: "#FCF9F7",
	},
	userDetailsContainer: {
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		paddingVertical: 10,
		marginHorizontal: 16,
		marginVertical: 10,
	},
	detailBox: {
		alignItems: 'center',
		width: '30%',
		backgroundColor: '#F4EFE5',
		paddingVertical: 8,
		borderRadius: 8,
	},
	label: {
		fontSize: 13,
		fontWeight: '600',
	},
	value: {
		fontSize: 15,
		fontWeight: '700',
		marginTop: 4,
	},
});