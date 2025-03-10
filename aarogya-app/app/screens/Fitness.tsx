import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { SafeAreaView, View, ScrollView, Image, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MainStackNavigationProps } from "../routes/MainStack";

export default function FitnessScreen() {
	const navigation = useNavigation<MainStackNavigationProps>();

	const handleButtonPress = () => {
		navigation.navigate("Camera");
	};

	return (
		<SafeAreaView 
			style={{
				flex: 1,
				backgroundColor: "#FFFFFF",
			}}>
			<ScrollView  
				style={{
					flex: 1,
					backgroundColor: "#FCFAF7",
				}}>
				<View 
					style={{
						backgroundColor: "#FCFAF7",
						paddingBottom: 72,
					}}>
					<View 
						style={{
							flexDirection: "row",
							alignItems: "center",
							backgroundColor: "#FCFAF7",
							paddingVertical: 28,
							paddingHorizontal: 16,
							marginBottom: 25,
						}}>
                        <Ionicons name="arrow-back" size={24} color="black" onPress={()=>{
							navigation.goBack();
						}}/>	
						<Text 
							style={{
								color: "#1C160C",
								marginStart: 16,
								fontSize: 18,
								flex: 1,
							}}>
							{"Challenges"}
						</Text>
					</View>
					<Text 
						style={{
							color: "#1C160C",
							fontSize: 22,
							marginBottom: 13,
							marginLeft: 18,
						}}>
						{"Morning"}
					</Text>
					<TouchableOpacity onPress={handleButtonPress}>
						<View 
							style={{
								flexDirection: "row",
								alignItems: "center",
								backgroundColor: "#FCFAF7",
								paddingVertical: 12,
								paddingHorizontal: 16,
							}}>
							<Image
								source = {{uri: "https://images.healthshots.com/healthshots/en/uploads/2023/05/10200007/exercise-1600x900.jpg"}} 
								resizeMode = {"stretch"}
								style={{
									borderRadius: 8,
									width: 100,
									height: 56,
									marginRight: 17,
								}}
							/>
							<View 
								style={{
									flex: 1,
								}}>
								<Text 
									style={{
										color: "#1C160C",
										fontSize: 16,
										marginBottom: 8,
									}}>
									{"Wake up your muscles"}
								</Text>
								<Text 
									style={{
										color: "red",
										fontSize: 14,
										// textAlign: "center",
									}}>
									{"Click here to start camera."}
								</Text>
							</View>
						</View>
					</TouchableOpacity>
					<View 
						style={{
							flexDirection: "row",
							alignItems: "center",
							backgroundColor: "#FCFAF7",
							paddingVertical: 17,
							paddingHorizontal: 16,
							marginBottom: 25,
						}}>
						<Image
							source = {{uri: "https://familydoctor.org/wp-content/uploads/2016/11/exercise-848x445.jpg"}} 
							resizeMode = {"stretch"}
							style={{
								borderRadius: 8,
								width: 100,
								height: 56,
								marginRight: 17,
							}}
						/>
						<View 
							style={{
								flex: 1,
							}}>
							<Text 
								style={{
									color: "#1C160C",
									fontSize: 16,
									marginBottom: 7,
								}}>
								{"Strengthen your core"}
							</Text>
							<Text 
								style={{
									color: "#A08249",
									fontSize: 14,
								}}>
								{"Spend 15 minutes doing plank exercises."}
							</Text>
						</View>
					</View>
					<Text 
						style={{
							color: "#1C160C",
							fontSize: 22,
							marginBottom: 13,
							marginLeft: 17,
						}}>
						{"Afternoon"}
					</Text>
					<View 
						style={{
							flexDirection: "row",
							alignItems: "center",
							backgroundColor: "#FCFAF7",
							paddingVertical: 17,
							paddingHorizontal: 16,
						}}>
						<Image
							source = {{uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXjv04eb3mQFwpjfxsnz4CxkL7WYy79X5J-Q&s"}} 
							resizeMode = {"stretch"}
							style={{
								borderRadius: 8,
								width: 100,
								height: 56,
								marginRight: 17,
							}}
						/>
						<View 
							style={{
								flex: 1,
							}}>
							<Text 
								style={{
									color: "#1C160C",
									fontSize: 16,
									marginBottom: 7,
									marginLeft: 1,
								}}>
								{"Improve your balance"}
							</Text>
							<Text 
								style={{
									color: "#A08249",
									fontSize: 14,
								}}>
								{"Practice standing on one leg for 5 minutes."}
							</Text>
						</View>
					</View>
					<View 
						style={{
							flexDirection: "row",
							alignItems: "center",
							backgroundColor: "#FCFAF7",
							paddingVertical: 17,
							paddingHorizontal: 16,
							marginBottom: 25,
						}}>
						<Image
							source = {{uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6CZQsPAmGl1L0ohfHlWi6O8y7oetOLHBVlA&s"}} 
							resizeMode = {"stretch"}
							style={{
								borderRadius: 8,
								width: 100,
								height: 56,
								marginRight: 17,
							}}
						/>
						<View 
							style={{
								flex: 1,
							}}>
							<Text 
								style={{
									color: "#1C160C",
									fontSize: 16,
									marginBottom: 7,
									marginLeft: 1,
								}}>
								{"Increase your mobility"}
							</Text>
							<Text 
								style={{
									color: "#A08249",
									fontSize: 14,
								}}>
								{"Move your body in all directions to increase flexibility."}
							</Text>
						</View>
					</View>
					<Text 
						style={{
							color: "#1C160C",
							fontSize: 22,
							marginBottom: 13,
							marginLeft: 18,
						}}>
						{"Evening"}
					</Text>
					<View 
						style={{
							flexDirection: "row",
							alignItems: "center",
							backgroundColor: "#FCFAF7",
							paddingVertical: 17,
							paddingHorizontal: 16,
						}}>
						<Image
							source = {{uri: "https://t4.ftcdn.net/jpg/05/60/71/17/360_F_560711707_j8eUDdgb5mySg6pNc8cfjcm0QZ9Qu2x5.jpg"}} 
							resizeMode = {"stretch"}
							style={{
								borderRadius: 8,
								width: 100,
								height: 56,
								marginRight: 17,
							}}
						/>
						<View 
							style={{
								flex: 1,
							}}>
							<Text 
								style={{
									color: "#1C160C",
									fontSize: 16,
									marginBottom: 7,
									marginLeft: 1,
								}}>
								{"Relax your muscles"}
							</Text>
							<Text 
								style={{
									color: "#A08249",
									fontSize: 14,
								}}>
								{"Finish your day with a 10-minute massage."}
							</Text>
						</View>
					</View>
					<View 
						style={{
							flexDirection: "row",
							alignItems: "center",
							backgroundColor: "#FCFAF7",
							paddingVertical: 12,
							paddingHorizontal: 16,
						}}>
						<Image
							source = {{uri: "https://static.toiimg.com/thumb/imgsize-1645516,msid-114778687,width-375,height-210,resizemode-75/114778687.jpg"}} 
							resizeMode = {"stretch"}
							style={{
								borderRadius: 8,
								width: 100,
								height: 56,
								marginRight: 17,
							}}
						/>
						<View 
							style={{
								flex: 1,
							}}>
							<Text 
								style={{
									color: "#1C160C",
									fontSize: 16,
									marginBottom: 8,
									marginLeft: 1,
								}}>
								{"Improve your posture"}
							</Text>
							<Text 
								style={{
									color: "#A08249",
									fontSize: 14,
									// textAlign: "center",
								}}>
								{"Sit straight and hold for 3 minutes."}
							</Text>
						</View>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	)
}