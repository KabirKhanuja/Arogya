import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useContext } from "react";
import { SafeAreaView, View, ScrollView, Text, Image, TouchableOpacity, } from "react-native";
import AppContext from "../auth/AuthContext";
import { ScoreContext } from "../context/ScoreContext";
import * as SecureStore from "expo-secure-store";
import { MainStackNavigationProps } from "../routes/MainStack";
import { UserType } from "../types/user";

export default function ProfileScreen() {
	const navigation = useNavigation<MainStackNavigationProps>();
	const { user } = useContext(AppContext);
	const { totalScore } = useContext(ScoreContext); // Get totalScore from context

	const handleReevaluate = async () => {
		await SecureStore.deleteItemAsync("roadmap");
		navigation.reset({
			index: 0,
			routes: [{ name: "form" }],
		});
	};

	const renderBadges = () => (
		<>
			<Text style={{ color: "#1C160C", fontSize: 18, marginBottom: 24, marginLeft: 17 }}>
				{"Badges"}
			</Text>

			{totalScore < 500 ? (
				<Text style={{
					color: "#9E7A47",
					fontSize: 16,
					marginBottom: 50,
					marginLeft: 17,
					fontStyle: 'italic'
				}}>
					{"No Badges Won"}
				</Text>
			) : (
				<>
					<View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 18, marginHorizontal: 16 }}>
						{totalScore >= 500 && (
							<Image
								source={{ uri: "https://kylesethgray.com/content/images/2018/08/thanksgiving_day_challenge_5k.png" }}
								resizeMode={"stretch"}
								style={{ borderRadius: 8, width: 173, height: 173 }}
							/>
						)}
						{totalScore >= 1000 && (
							<Image
								source={{ uri: "https://kylesethgray.com/content/images/2018/08/new_year_2017.png" }}
								resizeMode={"stretch"}
								style={{ borderRadius: 8, width: 173, height: 173 }}
							/>
						)}
					</View>
					<View style={{ flexDirection: "row", alignItems: "center", marginBottom: 7, marginLeft: 17, marginRight: 45 }}>
						{totalScore >= 500 && (
							<Text style={{ color: "#1C160C", fontSize: 16, marginRight: 4, flex: 1 }}>
								{"First Step Badge"}
							</Text>
						)}
						{totalScore >= 1000 && (
							<Text style={{ color: "#1C160C", fontSize: 16 }}>
								{"Second Step Badge"}
							</Text>
						)}
					</View>
					<View style={{ flexDirection: "row", alignItems: "center", marginBottom: 33, marginLeft: 16, marginRight: 68 }}>
						{totalScore >= 500 && (
							<Text style={{ color: "#9E7A47", fontSize: 14, marginRight: 4, flex: 1 }}>
								{"For getting 500 total score"}
							</Text>
						)}
						{totalScore >= 1000 && (
							<Text style={{ color: "#9E7A47", fontSize: 14, width: 121 }}>
								{"For getting 1000 total score"}
							</Text>
						)}
					</View>
					{totalScore >= 5000 && (
						<>
							<Image
								source={{ uri: "https://kylesethgray.com/content/images/2018/08/VeteransDay_Sticker.png" }}
								resizeMode={"stretch"}
								style={{ borderRadius: 8, width: 173, height: 173, marginBottom: 18, marginLeft: 16 }}
							/>
							<Text style={{ color: "#1C160C", fontSize: 16, marginBottom: 7, marginLeft: 17 }}>
								{"Five Steps Badge"}
							</Text>
							<Text style={{ color: "#9E7A47", fontSize: 14, marginBottom: 50, marginLeft: 16 }}>
								{"For getting 5000 total score"}
							</Text>
						</>
					)}
				</>
			)}
		</>
	);

	return (
		<SafeAreaView
			style={{
				flex: 1,
				backgroundColor: "#FFFFFF",
			}}>
			<ScrollView
				style={{
					flex: 1,
					backgroundColor: "#FFFFFF",
				}}>
				<View
					style={{
						backgroundColor: "#FCF9F7",
					}}>
					<View
						style={{
							alignItems: "center",
							backgroundColor: "#FCF9F7",
							paddingTop: 20,
							paddingBottom: 9,
							marginBottom: 16,
						}}>
						<Text
							style={{
								color: "#1C160C",
								fontSize: 18,
							}}>
							{"User Profile"}
						</Text>
					</View>
					<Image
						source={{ uri: "https://picsum.photos/200" }}
						resizeMode={"stretch"}
						style={{
							borderRadius: 64,
							height: 128,
							marginBottom: 19,
							marginHorizontal: 131,
						}}
					/>
					<Text
						style={{
							color: "#1C160C",
							fontSize: 22,
							textAlign: "center",
							marginBottom: 20,
						}}>
						{user?.name ? user.name : "User Name"}
					</Text>
					<Text
						style={{
							color: "#9E7A47",
							fontSize: 16,
							textAlign: "center",
							marginBottom: 20,
						}}>
						{`Age: ${user?.age ? user.age : ""}, Weight: ${user?.weight ? user.weight : ""} kgs, Height: ${user?.height ? user.height : ""} cms`}
					</Text>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "center",
							marginBottom: 24,
							marginHorizontal: 16,
						}}>
						<TouchableOpacity
							style={{
								width: 173,
								alignItems: "center",
								backgroundColor: "#F4EFE5",
								borderRadius: 8,
								paddingVertical: 15,
							}} onPress={handleReevaluate}>
							<Text
								style={{
									color: "#1C160C",
									fontSize: 14,
								}}>
								{"Re-evaluate"}
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={{
								width: 173,
								alignItems: "center",
								backgroundColor: "#F99E16",
								borderRadius: 8,
								paddingVertical: 15,
							}} onPress={() => navigation.navigate("Settings")}>
							<Text
								style={{
									color: "#1C160C",
									fontSize: 14,
								}}>
								{"Settings"}
							</Text>
						</TouchableOpacity>
					</View>
					<Text
						style={{
							color: "#9E7A47",
							fontSize: 16,
							marginBottom: 19,
							marginLeft: 122,
						}}>
						{"Recovery Progress"}
					</Text>
					<View
						style={{
							alignItems: "flex-start",
							backgroundColor: "#F5F0E5",
							borderRadius: 4,
							marginBottom: 29,
							marginHorizontal: 16,
						}}>
						<View
							style={{
								width: 179,
								height: 8,
								backgroundColor: "#F99E16",
								borderRadius: 4,
							}}>
						</View>
					</View>

					{renderBadges()}

					{/* <Text
						style={{
							color: "#1C160C",
							fontSize: 18,
							marginBottom: 25,
							marginLeft: 16,
						}}>
						{"Certificates"}
					</Text>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "center",
							marginBottom: 18,
							marginHorizontal: 16,
						}}>
						<Image
							source={{ uri: "https://i.etsystatic.com/23383377/r/il/833db7/3235267495/il_fullxfull.3235267495_cdo5.jpg" }}
							resizeMode={"stretch"}
							style={{
								borderRadius: 8,
								width: 173,
								height: 173,
							}}
						/>
						<Image
							source={{ uri: "https://i.etsystatic.com/23383377/r/il/7e92f8/4868914726/il_1080xN.4868914726_4lk8.jpg" }}
							resizeMode={"stretch"}
							style={{
								borderRadius: 8,
								width: 173,
								height: 173,
							}}
						/>
					</View>
					<View
						style={{
							flexDirection: "row",
							alignItems: "flex-start",
							marginBottom: 42,
							marginLeft: 16,
							marginRight: 55,
						}}>
						<View
							style={{
								width: 171,
								marginRight: 14,
							}}>
							<Text
								style={{
									color: "#1C160C",
									fontSize: 16,
									textAlign: "center",
									marginBottom: 7,
								}}>
								{"Completion Certificate"}
							</Text>
							<Text
								style={{
									color: "#9E7A47",
									fontSize: 14,
									width: 119,
								}}>
								{"For completing the program"}
							</Text>
						</View>
						<View
							style={{
								flex: 1,
							}}>
							<Text
								style={{
									color: "#1C160C",
									fontSize: 16,
									marginBottom: 15,
								}}>
								{"Goal Achievement Certificate"}
							</Text>
							<Text
								style={{
									color: "#9E7A47",
									fontSize: 14,
								}}>
								{"For reaching goals"}
							</Text>
						</View>
					</View> */}
					<TouchableOpacity
						style={{
							alignItems: "center",
							backgroundColor: "#F99E16",
							borderRadius: 8,
							paddingVertical: 15,
							marginBottom: 12,
							marginHorizontal: 16,
						}} onPress={() => alert('Pressed!')}>
						<Text
							style={{
								color: "#1C160C",
								fontSize: 14,
							}}>
							{"Share on social media"}
						</Text>
					</TouchableOpacity>
					<View
						style={{
							height: 20,
							backgroundColor: "#FCF9F7",
						}}>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	)
}